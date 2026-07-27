"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadPhotoIfPresent, deletePhoto } from "@/lib/photo-upload";

function strOrNull(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export async function addTestResult(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const photoPath = await uploadPhotoIfPresent(supabase, clientId, formData);

  const { error } = await supabase.from("test_results").insert({
    client_id: clientId,
    log_date: String(formData.get("log_date")),
    col1: strOrNull(formData.get("col1")),
    col2: strOrNull(formData.get("col2")),
    col3: strOrNull(formData.get("col3")),
    photo_path: photoPath,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/test-resultaten`);
}

export async function updateTestResult(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("test_results")
    .select("client_id, photo_path")
    .eq("id", id)
    .single();

  const update: Record<string, string | null> = {
    log_date: String(formData.get("log_date")),
    col1: strOrNull(formData.get("col1")),
    col2: strOrNull(formData.get("col2")),
    col3: strOrNull(formData.get("col3")),
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

  const { error } = await supabase
    .from("test_results")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteTestResult(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("test_results")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("test_results").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing) await deletePhoto(supabase, existing.photo_path);
  revalidatePath("/klanten", "layout");
}
