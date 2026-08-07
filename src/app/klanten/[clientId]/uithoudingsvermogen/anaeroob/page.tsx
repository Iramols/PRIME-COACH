import { createClient } from "@/lib/supabase/server";
import type { AnaerobeTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../../log-table";
import {
  addAnaerobeTest,
  updateAnaerobeTest,
  deleteAnaerobeTest,
} from "./actions";

export default async function AnaerobeTestenPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("anaerobe_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<AnaerobeTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Anaerobe testen</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          { key: "quebec_10s_watt", label: "Quebec 10 sec test (Watt)", type: "number" },
          {
            key: "vertical_jump_cm",
            label: "Verticale spronghoogte (cm)",
            type: "number",
          },
          { key: "wingate_watt", label: "Wingate test (Watt)", type: "number" },
        ]}
        photoEnabled
        onAdd={addAnaerobeTest}
        onUpdate={updateAnaerobeTest}
        onDelete={deleteAnaerobeTest}
      />
    </div>
  );
}
