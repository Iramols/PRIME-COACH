import { createClient } from "@/lib/supabase/server";
import type { KrachtTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../log-table";
import { addKrachtTest, updateKrachtTest, deleteKrachtTest } from "./actions";

export default async function KrachtPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("kracht_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<KrachtTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Kracht</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          {
            key: "reverse_pushup_cm",
            label: "Omgekeerde push ups (cm)",
            type: "number",
          },
          {
            key: "grip_strength_kg",
            label: "Handknijpkracht (kg)",
            type: "number",
          },
          { key: "pushups_30s", label: "Push ups (#/30 sec)", type: "number" },
          {
            key: "leg_raise_time",
            label: "Beenheffen in rugligging (min:sec)",
            placeholder: "mm:ss",
          },
          { key: "wall_sit_sec", label: "Muurzittest (sec)", type: "number" },
          {
            key: "standing_long_jump_cm",
            label: "Verspringen uit stilstand (cm)",
            type: "number",
          },
          { key: "situps_per_min", label: "Situp (#/min)", type: "number" },
          {
            key: "plank_time",
            label: "Plank (min:sec)",
            placeholder: "mm:ss",
          },
          { key: "one_rm_kg", label: "1RM (kg)", type: "number" },
          {
            key: "one_rm_estimate_kg",
            label: "1 RM schatting (kg)",
            type: "number",
          },
        ]}
        photoEnabled
        onAdd={addKrachtTest}
        onUpdate={updateKrachtTest}
        onDelete={deleteKrachtTest}
      />
    </div>
  );
}
