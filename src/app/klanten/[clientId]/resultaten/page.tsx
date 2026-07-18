import { createClient } from "@/lib/supabase/server";
import type { Client, Result } from "@/lib/types";
import { calculateBmi } from "@/lib/calculations";
import { LogTable, type LogRow } from "../log-table";
import { addResult, updateResult, deleteResult } from "./actions";

export default async function ResultatenPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const [{ data: results }, { data: client }] = await Promise.all([
    supabase
      .from("results")
      .select("*")
      .eq("client_id", clientId)
      .order("log_date", { ascending: false })
      .returns<Result[]>(),
    supabase
      .from("clients")
      .select("height_cm")
      .eq("id", clientId)
      .single<Pick<Client, "height_cm">>(),
  ]);

  const heightCm = client?.height_cm ?? null;

  const rows = (results ?? []).map((result) => ({
    ...result,
    bmi: calculateBmi(result.weight_kg, heightCm) ?? "—",
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Resultaten</h1>
      <p className="text-xs text-neutral-400">
        BMI wordt automatisch berekend uit gewicht en de lengte uit het
        profiel{heightCm ? ` (${heightCm} cm)` : " (nog geen lengte ingevuld in het profiel)"}.
      </p>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          { key: "weight_kg", label: "Gewicht (kg)", type: "number" },
          { key: "fat_pct", label: "Vet %", type: "number" },
          { key: "waist_cm", label: "Omtrek navel (cm)", type: "number" },
          { key: "visceral_fat", label: "Visceraal vet", type: "number" },
          { key: "muscle_mass_kg", label: "Spiermassa (kg)", type: "number" },
          { key: "muscle_mass_pct", label: "Spiermassa %", type: "number" },
        ]}
        extraColumnLabel="BMI"
        extraColumnKey="bmi"
        onAdd={addResult}
        onUpdate={updateResult}
        onDelete={deleteResult}
      />
    </div>
  );
}
