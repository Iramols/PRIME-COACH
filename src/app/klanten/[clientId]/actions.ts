"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function updateProfiel(clientId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update({
      name: String(formData.get("name") ?? "").trim() || "Naamloze klant",
      age: numOrNull(formData.get("age")),
      weight_kg: numOrNull(formData.get("weight_kg")),
      height_cm: numOrNull(formData.get("height_cm")),
      gender: strOrNull(formData.get("gender")),
      goal: strOrNull(formData.get("goal")),
      activity_level: strOrNull(formData.get("activity_level")),
    })
    .eq("id", clientId);

  if (error) throw new Error(error.message);

  revalidatePath(`/klanten/${clientId}`, "layout");
  revalidatePath("/klanten");
}
