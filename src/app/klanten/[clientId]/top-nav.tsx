"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "@/lib/constants";

export function TopNav({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-neutral-200 px-2">
      {NAV_TABS.map((tab) => {
        const href = `/klanten/${clientId}/${tab.href}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.href}
            href={href}
            className={`rounded-t-md px-3 py-2 text-sm font-medium ${
              active
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
