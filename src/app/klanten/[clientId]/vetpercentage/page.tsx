import { createClient } from "@/lib/supabase/server";
import type { VetpercentageTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
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
  const { data: tests } = await supabase
    .from("vetpercentage_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<VetpercentageTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Vetpercentage</h1>
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
        photoEnabled
        onAdd={addVetpercentageTest}
        onUpdate={updateVetpercentageTest}
        onDelete={deleteVetpercentageTest}
      />
    </div>
  );
}
