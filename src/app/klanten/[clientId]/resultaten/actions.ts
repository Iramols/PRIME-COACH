"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadPhotoIfPresent, deletePhoto } from "@/lib/photo-upload";

function numOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null) return null;
  const normalized = String(value).trim().replace(",", ".");
  if (normalized === "") return null;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function resultFields(formData: FormData) {
  return {
    log_date: String(formData.get("log_date")),
    weight_kg: numOrNull(formData.get("weight_kg")),
    fat_pct: numOrNull(formData.get("fat_pct")),
    waist_cm: numOrNull(formData.get("waist_cm")),
    visceral_fat: numOrNull(formData.get("visceral_fat")),
    muscle_mass_kg: numOrNull(formData.get("muscle_mass_kg")),
    muscle_mass_pct: numOrNull(formData.get("muscle_mass_pct")),
  };
}

export async function addResult(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const photoPath = await uploadPhotoIfPresent(supabase, clientId, formData);

  const { error } = await supabase.from("results").insert({
    client_id: clientId,
    ...resultFields(formData),
    photo_path: photoPath,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/resultaten`);
}

export async function updateResult(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("results")
    .select("client_id, photo_path")
    .eq("id", id)
    .single();

  const update: Record<string, string | number | null> = resultFields(formData);

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

  const { error } = await supabase.from("results").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteResult(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("results")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("results").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing) await deletePhoto(supabase, existing.photo_path);
  revalidatePath("/klanten", "layout");
}
