import { createClient } from "@/lib/supabase/server";
import type { LenigheidTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../log-table";
import {
  addLenigheidTest,
  updateLenigheidTest,
  deleteLenigheidTest,
} from "./actions";

export default async function LenigheidPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("lenigheid_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<LenigheidTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Lenigheid</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          { key: "sit_reach_cm", label: "Sit & reach (cm)", type: "number" },
          {
            key: "shoulder_stretch_left_cm",
            label: "Schouderstretch links (cm)",
            type: "number",
          },
          {
            key: "shoulder_stretch_right_cm",
            label: "Schouderstretch rechts (cm)",
            type: "number",
          },
          {
            key: "straight_leg_bend_cm",
            label: "Buigen met gestrekte knieën (cm)",
            type: "number",
          },
        ]}
        photoEnabled
        onAdd={addLenigheidTest}
        onUpdate={updateLenigheidTest}
        onDelete={deleteLenigheidTest}
      />
    </div>
  );
}
