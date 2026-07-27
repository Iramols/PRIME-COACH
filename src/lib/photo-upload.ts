import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "log-photos";

export async function uploadPhotoIfPresent(
  supabase: SupabaseClient,
  clientId: string,
  formData: FormData,
): Promise<string | null> {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${clientId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function deletePhoto(
  supabase: SupabaseClient,
  path: string | null | undefined,
) {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function getSignedPhotoUrl(
  supabase: SupabaseClient,
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
