import { createClient } from "@/lib/supabase/server";
import type { CoordinatieTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../log-table";
import {
  addCoordinatieTest,
  updateCoordinatieTest,
  deleteCoordinatieTest,
} from "./actions";

export default async function CoordinatiePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("coordinatie_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<CoordinatieTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Coördinatie</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          {
            key: "indian_hop_test",
            label: "Indiaanse huppeltest (#)",
            type: "number",
          },
          {
            key: "hexagon_obstacle_test",
            label: "Zeshoek obstakel (#)",
            type: "number",
          },
        ]}
        photoEnabled
        onAdd={addCoordinatieTest}
        onUpdate={updateCoordinatieTest}
        onDelete={deleteCoordinatieTest}
      />
    </div>
  );
}
