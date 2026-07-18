import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createKlant, deleteKlant } from "./actions";
import { LogoutButton } from "../logout-button";
import { DeleteClientButton } from "./delete-client-button";
import type { Client } from "@/lib/types";
import { NAV_TABS } from "@/lib/constants";

export default async function KlantenPage() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true })
    .returns<Client[]>();

  if (error) {
    console.error("Kon klanten niet ophalen:", error);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Klantdossiers
        </h1>
        <LogoutButton />
      </div>

      <form
        action={createKlant}
        className="mb-8 flex gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
      >
        <input
          name="name"
          required
          placeholder="Naam nieuwe klant"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Klant toevoegen
        </button>
      </form>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Kon klanten niet ophalen: {error.message}
        </p>
      )}

      {!error && (!clients || clients.length === 0) && (
        <p className="text-sm text-neutral-500">
          Nog geen klanten. Voeg hierboven je eerste klant toe.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {clients?.map((client) => (
          <li
            key={client.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm hover:border-emerald-400"
          >
            <Link
              href={`/klanten/${client.id}/${NAV_TABS[0].href}`}
              className="flex flex-1 items-center justify-between"
            >
              <span className="font-medium text-neutral-900">
                {client.name}
              </span>
              <span className="text-sm text-neutral-400">
                {client.goal ?? "Geen doel ingesteld"}
              </span>
            </Link>
            <DeleteClientButton
              clientId={client.id}
              clientName={client.name}
              onDelete={deleteKlant}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
