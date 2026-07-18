import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/lib/types";
import { TopNav } from "./top-nav";
import { ClientSwitcher } from "./client-switcher";
import { ProfileModal } from "./profile-modal";
import { LogoutButton } from "../../logout-button";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const [{ data: client, error: clientError }, { data: clients }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", clientId).single<Client>(),
    supabase
      .from("clients")
      .select("id, name")
      .order("name", { ascending: true })
      .returns<Pick<Client, "id" | "name">[]>(),
  ]);

  if (clientError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Kon klantgegevens niet ophalen: {clientError.message}
        </p>
      </div>
    );
  }

  if (!client) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-col gap-3 border-b border-neutral-200 bg-white px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/klanten" className="text-sm text-neutral-400 hover:text-neutral-700">
              &larr; Alle klanten
            </Link>
            <ClientSwitcher clients={clients ?? []} activeClientId={clientId} />
          </div>
          <div className="flex items-center gap-4">
            <LogoutButton />
            <ProfileModal client={client} />
          </div>
        </div>
        <TopNav clientId={clientId} />
      </header>
      <main className="flex-1 bg-neutral-50 p-6">{children}</main>
    </div>
  );
}
