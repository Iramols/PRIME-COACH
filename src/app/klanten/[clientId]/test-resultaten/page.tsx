import { createClient } from "@/lib/supabase/server";
import type { TestResult } from "@/lib/types";
import { LogTable } from "../log-table";
import { addTestResult, updateTestResult, deleteTestResult } from "./actions";

export default async function TestResultatenPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: testResults } = await supabase
    .from("test_results")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<TestResult[]>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Test resultaten</h1>
      <p className="text-xs text-neutral-400">
        Kolommen zijn nog niet definitief vastgesteld — vul later een naam en
        betekenis in.
      </p>
      <LogTable
        clientId={clientId}
        rows={testResults ?? []}
        columns={[
          { key: "col1", label: "Kolom 1" },
          { key: "col2", label: "Kolom 2" },
          { key: "col3", label: "Kolom 3" },
        ]}
        onAdd={addTestResult}
        onUpdate={updateTestResult}
        onDelete={deleteTestResult}
      />
    </div>
  );
}
