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

function fields(formData: FormData) {
  return {
    log_date: String(formData.get("log_date")),
    sit_reach_cm: numOrNull(formData.get("sit_reach_cm")),
    shoulder_stretch_left_cm: numOrNull(formData.get("shoulder_stretch_left_cm")),
    shoulder_stretch_right_cm: numOrNull(formData.get("shoulder_stretch_right_cm")),
    straight_leg_bend_cm: numOrNull(formData.get("straight_leg_bend_cm")),
  };
}

export async function addLenigheidTest(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const photoPath = await uploadPhotoIfPresent(supabase, clientId, formData);

  const { error } = await supabase.from("lenigheid_testen").insert({
    client_id: clientId,
    ...fields(formData),
    photo_path: photoPath,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/lenigheid`);
}

export async function updateLenigheidTest(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("lenigheid_testen")
    .select("client_id, photo_path")
    .eq("id", id)
    .single();

  const update: Record<string, string | number | null> = fields(formData);

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
    .from("lenigheid_testen")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteLenigheidTest(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("lenigheid_testen")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("lenigheid_testen")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (existing) await deletePhoto(supabase, existing.photo_path);
  revalidatePath("/klanten", "layout");
}
