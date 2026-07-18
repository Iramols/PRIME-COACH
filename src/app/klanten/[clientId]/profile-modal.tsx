"use client";

import { useState, useTransition } from "react";
import type { Client } from "@/lib/types";
import { formatDateTime } from "@/lib/calculations";
import {
  GESLACHT_OPTIES,
  DOEL_OPTIES,
  ACTIVITEITSNIVEAU_OPTIES,
} from "@/lib/constants";
import { updateProfiel } from "./actions";

export function ProfileModal({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProfiel(client.id, formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Jouw profiel"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
      >
        {client.name?.charAt(0).toUpperCase() || "?"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-1 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                Jouw profiel
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <p className="mb-5 text-xs text-neutral-400">
              Laatste update: {formatDateTime(client.updated_at)}
            </p>

            <form action={handleSubmit} className="flex flex-col gap-4">
              <Field label="Naam">
                <input
                  name="name"
                  defaultValue={client.name}
                  required
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Leeftijd">
                  <input
                    name="age"
                    type="number"
                    inputMode="numeric"
                    defaultValue={client.age ?? ""}
                    className="input"
                  />
                </Field>
                <Field label="Gewicht (kg)">
                  <input
                    name="weight_kg"
                    type="text"
                    inputMode="decimal"
                    defaultValue={client.weight_kg ?? ""}
                    placeholder="85,3"
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Lengte (cm)">
                  <input
                    name="height_cm"
                    type="number"
                    inputMode="numeric"
                    defaultValue={client.height_cm ?? ""}
                    className="input"
                  />
                </Field>
                <Field label="Geslacht">
                  <select
                    name="gender"
                    defaultValue={client.gender ?? ""}
                    className="input"
                  >
                    <option value="">Kies...</option>
                    {GESLACHT_OPTIES.map((optie) => (
                      <option key={optie} value={optie}>
                        {optie}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Doel">
                <select
                  name="goal"
                  defaultValue={client.goal ?? ""}
                  className="input"
                >
                  <option value="">Kies...</option>
                  {DOEL_OPTIES.map((optie) => (
                    <option key={optie} value={optie}>
                      {optie}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Activiteitsniveau">
                <select
                  name="activity_level"
                  defaultValue={client.activity_level ?? ""}
                  className="input"
                >
                  <option value="">Kies...</option>
                  {ACTIVITEITSNIVEAU_OPTIES.map((optie) => (
                    <option key={optie} value={optie}>
                      {optie}
                    </option>
                  ))}
                </select>
              </Field>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                Opslaan ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}
