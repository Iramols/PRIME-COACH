import { createClient } from "@/lib/supabase/server";
import type { SubMaxAerobeTest } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../../log-table";
import {
  addSubMaxAerobeTest,
  updateSubMaxAerobeTest,
  deleteSubMaxAerobeTest,
} from "./actions";

export default async function SubMaxAerobeTestenPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("sub_max_aerobe_testen")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<SubMaxAerobeTest[]>();

  const rows = await Promise.all(
    (tests ?? []).map(async (test) => ({
      ...test,
      photo_url: await getSignedPhotoUrl(supabase, test.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Sub max aerobe testen</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          {
            key: "astrand_vo2max_lmin",
            label: "Astrand VO2 max (L/min)",
            type: "number",
          },
          { key: "six_min_walk_m", label: "6 min wandeltest (m)", type: "number" },
        ]}
        photoEnabled
        onAdd={addSubMaxAerobeTest}
        onUpdate={updateSubMaxAerobeTest}
        onDelete={deleteSubMaxAerobeTest}
      />
    </div>
  );
}
