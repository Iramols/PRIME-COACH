"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS, type NavGroup, type NavTab } from "@/lib/constants";

function isGroup(tab: NavTab | NavGroup): tab is NavGroup {
  return "children" in tab;
}

export function TopNav({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="flex flex-wrap gap-1 border-b border-neutral-200 px-2">
      {NAV_TABS.map((tab) => {
        if (isGroup(tab)) {
          const active = tab.children.some(
            (child) => pathname === `/klanten/${clientId}/${child.href}`,
          );
          const isOpen = openGroup === tab.label;
          return (
            <div key={tab.label} className="relative">
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : tab.label)}
                className={`flex items-center gap-1 rounded-t-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "border-b-2 border-emerald-600 text-emerald-700"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
                <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="absolute left-0 top-full z-20 min-w-56 rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
                  {tab.children.map((child) => {
                    const href = `/klanten/${clientId}/${child.href}`;
                    const childActive = pathname === href;
                    return (
                      <Link
                        key={child.href}
                        href={href}
                        onClick={() => setOpenGroup(null)}
                        className={`block px-4 py-2 text-sm ${
                          childActive
                            ? "bg-emerald-50 font-medium text-emerald-700"
                            : "text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

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
