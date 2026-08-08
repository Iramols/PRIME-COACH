import { createClient } from "@/lib/supabase/server";
import type { SnelheidTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../log-table";
import {
  addSnelheidTest,
  updateSnelheidTest,
  deleteSnelheidTest,
} from "./actions";

export default async function SnelheidPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("snelheid_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<SnelheidTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Snelheid</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          {
            key: "ten_x_5m_loop_sec",
            label: "10x 5m loop (0,1 sec)",
            type: "number",
          },
          { key: "fast_feet_sec", label: "Snelle voeten (sec)", type: "number" },
          { key: "t_test_sec", label: "T-test (sec)", type: "number" },
        ]}
        photoEnabled
        onAdd={addSnelheidTest}
        onUpdate={updateSnelheidTest}
        onDelete={deleteSnelheidTest}
      />
    </div>
  );
}
