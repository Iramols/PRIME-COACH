import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types";
import { getSignedPhotoUrl } from "@/lib/photo-upload";
import { LogTable, type LogRow } from "../log-table";
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

  const rows = await Promise.all(
    (notes ?? []).map(async (note) => ({
      ...note,
      photo_url: await getSignedPhotoUrl(supabase, note.photo_path),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Notities</h1>
      <LogTable
        clientId={clientId}
        rows={rows as unknown as LogRow[]}
        columns={[
          { key: "nutrition", label: "Voeding" },
          { key: "training", label: "Training" },
          { key: "remarks", label: "Bijzonderheden" },
        ]}
        photoEnabled
        onAdd={addNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />
    </div>
  );
}
