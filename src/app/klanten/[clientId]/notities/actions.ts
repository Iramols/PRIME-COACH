"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadPhotoIfPresent, deletePhoto } from "@/lib/photo-upload";

function strOrNull(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export async function addNote(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const photoPath = await uploadPhotoIfPresent(supabase, clientId, formData);

  const { error } = await supabase.from("notes").insert({
    client_id: clientId,
    log_date: String(formData.get("log_date")),
    nutrition: strOrNull(formData.get("nutrition")),
    training: strOrNull(formData.get("training")),
    remarks: strOrNull(formData.get("remarks")),
    photo_path: photoPath,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/notities`);
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("notes")
    .select("client_id, photo_path")
    .eq("id", id)
    .single();

  const update: Record<string, string | null> = {
    log_date: String(formData.get("log_date")),
    nutrition: strOrNull(formData.get("nutrition")),
    training: strOrNull(formData.get("training")),
    remarks: strOrNull(formData.get("remarks")),
  };

  if (existing) {
    const newPhotoPath = await uploadPhotoIfPresent(
      supabase,
      existing.client_id,
      formData,
    );
    if (newPhotoPath) {
      await deletePhoto(supabase, existing.photo_path);
      update.photo_path = newPhotoPath;
    }
  }

  const { error } = await supabase.from("notes").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteNote(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("notes")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing) await deletePhoto(supabase, existing.photo_path);
  revalidatePath("/klanten", "layout");
}
