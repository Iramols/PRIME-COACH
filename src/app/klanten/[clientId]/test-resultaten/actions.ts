"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function strOrNull(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export async function addTestResult(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("test_results").insert({
    client_id: clientId,
    log_date: String(formData.get("log_date")),
    col1: strOrNull(formData.get("col1")),
    col2: strOrNull(formData.get("col2")),
    col3: strOrNull(formData.get("col3")),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/klanten/${clientId}/test-resultaten`);
}

export async function updateTestResult(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("test_results")
    .update({
      log_date: String(formData.get("log_date")),
      col1: strOrNull(formData.get("col1")),
      col2: strOrNull(formData.get("col2")),
      col3: strOrNull(formData.get("col3")),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}

export async function deleteTestResult(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("test_results").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/klanten", "layout");
}
