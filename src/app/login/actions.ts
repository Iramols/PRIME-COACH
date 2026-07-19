"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function findBadChar(value: string | undefined, label: string) {
  if (!value) {
    console.error(`${label}: ontbreekt (undefined/leeg)`);
    return;
  }
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code > 255) {
      console.error(
        `${label}: niet-Latin1 teken op index ${i}, code ${code} (lengte totaal: ${value.length})`,
      );
      return;
    }
  }
  console.error(`${label}: schoon (lengte ${value.length}, geen rare tekens)`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  findBadChar(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  findBadChar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  findBadChar(email, "email (ingevoerd)");
  findBadChar(password, "password (ingevoerd)");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login mislukt - volledige fout:", {
      message: error.message,
      name: error.name,
      status: "status" in error ? error.status : undefined,
      cause: error.cause,
      stack: error.stack,
    });
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/klanten");
}
