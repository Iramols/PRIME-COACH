import { createClient } from "@/lib/supabase/server";
import type { Client, VetpercentageTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { calculateBodyFatPercent } from "@/lib/calculations";
import { LogTable, type LogRow } from "../log-table";
import {
  addVetpercentageTest,
  updateVetpercentageTest,
  deleteVetpercentageTest,
} from "./actions";

export default async function VetpercentagePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const [{ data: tests }, { data: client }] = await Promise.all([
    supabase
      .from("vetpercentage_testen")
      .select("*")
      .eq("client_id", clientId)
      .order("log_date", { ascending: false })
      .returns<VetpercentageTest[]>(),
    supabase
      .from("clients")
      .select("age, gender")
      .eq("id", clientId)
      .single<Pick<Client, "age" | "gender">>(),
  ]);

  const age = client?.age ?? null;
  const gender = client?.gender ?? null;

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => {
      const sum =
        (test.triceps_skinfold_mm ?? 0) +
        (test.biceps_skinfold_mm ?? 0) +
        (test.subscapular_skinfold_mm ?? 0) +
        (test.suprailiac_skinfold_mm ?? 0);
      const hasAllFour =
        test.triceps_skinfold_mm != null &&
        test.biceps_skinfold_mm != null &&
        test.subscapular_skinfold_mm != null &&
        test.suprailiac_skinfold_mm != null;

      return {
        ...test,
        vetpercentage: hasAllFour
          ? (calculateBodyFatPercent(sum, age, gender) ?? "—")
          : "—",
        photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
      };
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Vetpercentage</h1>
      <p className="text-xs text-neutral-400">
        Vetpercentage wordt automatisch berekend uit de som van de 4
        huidplooien met de Durnin &amp; Womersley-formule, op basis van
        leeftijd en geslacht uit het profiel
        {age && gender
          ? ` (${age} jaar, ${gender.toLowerCase()})`
          : " (nog geen leeftijd/geslacht ingevuld in het profiel)"}
        . Foutmarge: circa ±3,5% (vrouwen) / ±5% (mannen).
      </p>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          {
            key: "triceps_skinfold_mm",
            label: "Triceps huidplooi (mm)",
            type: "number",
          },
          {
            key: "biceps_skinfold_mm",
            label: "Biceps huidplooi (mm)",
            type: "number",
          },
          {
            key: "subscapular_skinfold_mm",
            label: "Subscapulaire huidplooi (mm)",
            type: "number",
          },
          {
            key: "suprailiac_skinfold_mm",
            label: "Supra-iliacale huidplooi (mm)",
            type: "number",
          },
        ]}
        extraColumnLabel="Vetpercentage (%)"
        extraColumnKey="vetpercentage"
        photoEnabled
        onAdd={addVetpercentageTest}
        onUpdate={updateVetpercentageTest}
        onDelete={deleteVetpercentageTest}
      />
    </div>
  );
}
