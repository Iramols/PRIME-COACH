"use client";

import { useRouter } from "next/navigation";
import type { Client } from "@/lib/types";
import { NAV_TABS } from "@/lib/constants";

export function ClientSwitcher({
  clients,
  activeClientId,
}: {
  clients: Pick<Client, "id" | "name">[];
  activeClientId: string;
}) {
  const router = useRouter();

  return (
    <select
      value={activeClientId}
      onChange={(e) => router.push(`/klanten/${e.target.value}/${NAV_TABS[0].href}`)}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm font-medium text-neutral-700"
    >
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      ))}
    </select>
  );
}
