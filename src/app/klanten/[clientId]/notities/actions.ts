"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function strOrNull(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export async function addNote(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({
    client_id: clientId,
    log_date: String(formData.get("log_date")),
    nutrition: strOrNull(formData.get("nutrition")),
    training: strOrNull(formData.get("training")),
    remarks: strOrNull(formData.get("remarks")),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/notities`);
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({
      log_date: String(formData.get("log_date")),
      nutrition: strOrNull(formData.get("nutrition")),
      training: strOrNull(formData.get("training")),
      remarks: strOrNull(formData.get("remarks")),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}
