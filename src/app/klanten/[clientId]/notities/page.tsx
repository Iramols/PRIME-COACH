import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types";
import { LogTable } from "../log-table";
import { addNote, updateNote, deleteNote } from "./actions";

export default async function NotitiesPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("client_id", clientId)
    .order("log_date", { ascending: false })
    .returns<Note[]>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Notities</h1>
      <LogTable
        clientId={clientId}
        rows={notes ?? []}
        columns={[
          { key: "nutrition", label: "Voeding" },
          { key: "training", label: "Training" },
          { key: "remarks", label: "Bijzonderheden" },
        ]}
        onAdd={addNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />
    </div>
  );
}
