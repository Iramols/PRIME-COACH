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

function strOrNull(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function fields(formData: FormData) {
  return {
    log_date: String(formData.get("log_date")),
    reverse_pushup_cm: numOrNull(formData.get("reverse_pushup_cm")),
    grip_strength_kg: numOrNull(formData.get("grip_strength_kg")),
    pushups_30s: numOrNull(formData.get("pushups_30s")),
    leg_raise_time: strOrNull(formData.get("leg_raise_time")),
    wall_sit_sec: numOrNull(formData.get("wall_sit_sec")),
    standing_long_jump_cm: numOrNull(formData.get("standing_long_jump_cm")),
    situps_per_min: numOrNull(formData.get("situps_per_min")),
    plank_time: strOrNull(formData.get("plank_time")),
    one_rm_kg: numOrNull(formData.get("one_rm_kg")),
    one_rm_estimate_kg: numOrNull(formData.get("one_rm_estimate_kg")),
  };
}

export async function addKrachtTest(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const photoPath = await uploadPhotoIfPresent(supabase, clientId, formData);

  const { error } = await supabase.from("kracht_testen").insert({
    client_id: clientId,
    ...fields(formData),
    photo_path: photoPath,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/kracht`);
}

export async function updateKrachtTest(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("kracht_testen")
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
    .from("kracht_testen")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteKrachtTest(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("kracht_testen")
    .select("photo_path")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("kracht_testen")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (existing) await deletePhoto(supabase, existing.photo_path);
  revalidatePath("/klanten", "layout");
}
