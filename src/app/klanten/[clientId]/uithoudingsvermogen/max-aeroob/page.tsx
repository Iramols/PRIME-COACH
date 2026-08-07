import { createClient } from "@/lib/supabase/server";
import type { MaxAerobeTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../../log-table";
import {
  addMaxAerobeTest,
  updateMaxAerobeTest,
  deleteMaxAerobeTest,
} from "./actions";

export default async function MaxAerobeTestenPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("max_aerobe_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<MaxAerobeTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Max aerobe testen</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          { key: "six_min_loop_m", label: "6 min loop (m)", type: "number" },
          { key: "shuttle_run_m", label: "Shuttlerun (m)", type: "number" },
          { key: "cooper_test_m", label: "Coopertest (m)", type: "number" },
          {
            key: "one_mile_time",
            label: "1 mijl (min:sec)",
            placeholder: "mm:ss",
          },
        ]}
        photoEnabled
        onAdd={addMaxAerobeTest}
        onUpdate={updateMaxAerobeTest}
        onDelete={deleteMaxAerobeTest}
      />
    </div>
  );
}
