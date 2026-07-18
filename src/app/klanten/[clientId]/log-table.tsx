"use client";

import { useState, useTransition } from "react";
import { formatDate } from "@/lib/calculations";

export type LogColumn = {
  key: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
};

export type LogRow = {
  id: string;
  log_date: string;
  [key: string]: string | number | null;
};

type Props = {
  clientId: string;
  columns: LogColumn[];
  rows: LogRow[];
  onAdd: (clientId: string, formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  extraColumnLabel?: string;
  extraColumnKey?: string;
};

export function LogTable({
  clientId,
  columns,
  rows,
  onAdd,
  onUpdate,
  onDelete,
  extraColumnLabel,
  extraColumnKey,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await onAdd(clientId, formData);
    });
  }

  function handleUpdate(id: string, formData: FormData) {
    startTransition(async () => {
      await onUpdate(id, formData);
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Deze rij verwijderen?")) return;
    startTransition(async () => {
      await onDelete(id);
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <th className="px-3 py-2 font-medium">Datum</th>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 font-medium">
                {col.label}
              </th>
            ))}
            {extraColumnLabel && (
              <th className="px-3 py-2 font-medium">{extraColumnLabel}</th>
            )}
            <th className="px-3 py-2 font-medium">Acties</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            editingId === row.id ? (
              <tr key={row.id} className="border-b border-neutral-100 align-top">
                <td className="px-3 py-2" colSpan={columns.length + (extraColumnLabel ? 2 : 1)}>
                  <form
                    action={(fd) => handleUpdate(row.id, fd)}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <Field label="Datum" hideLabel>
                      <input
                        name="log_date"
                        type="date"
                        defaultValue={row.log_date}
                        required
                        className="input"
                      />
                    </Field>
                    {columns.map((col) => (
                      <Field key={col.key} label={col.label} hideLabel>
                        <input
                          name={col.key}
                          type={col.type === "number" ? "text" : "text"}
                          inputMode={col.type === "number" ? "decimal" : undefined}
                          defaultValue={row[col.key] ?? ""}
                          placeholder={col.placeholder ?? col.label}
                          className="input"
                        />
                      </Field>
                    ))}
                    <div className="flex gap-2 pb-0.5">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Opslaan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                      >
                        Annuleren
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="border-b border-neutral-100">
                <td className="whitespace-nowrap px-3 py-2 text-neutral-700">
                  {formatDate(row.log_date)}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 text-neutral-700">
                    {row[col.key] ?? ""}
                  </td>
                ))}
                {extraColumnKey && (
                  <td className="px-3 py-2 text-neutral-700">
                    {row[extraColumnKey] ?? "—"}
                  </td>
                )}
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    onClick={() => setEditingId(row.id)}
                    className="mr-3 text-xs font-medium text-emerald-700 hover:underline"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ),
          )}

          <tr className="bg-neutral-50">
            <td className="px-3 py-2" colSpan={columns.length + (extraColumnLabel ? 2 : 1) + 1}>
              <form
                action={handleAdd}
                className="flex flex-wrap items-end gap-3"
              >
                <Field label="Datum" hideLabel>
                  <input
                    name="log_date"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    required
                    className="input"
                  />
                </Field>
                {columns.map((col) => (
                  <Field key={col.key} label={col.label} hideLabel>
                    <input
                      name={col.key}
                      type="text"
                      inputMode={col.type === "number" ? "decimal" : undefined}
                      placeholder={col.placeholder ?? col.label}
                      className="input"
                    />
                  </Field>
                ))}
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  + Rij toevoegen
                </button>
              </form>
            </td>
          </tr>

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (extraColumnLabel ? 2 : 1) + 1}
                className="px-3 py-6 text-center text-neutral-400"
              >
                Nog geen gegevens gelogd.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Field({
  label,
  children,
  hideLabel,
}: {
  label: string;
  children: React.ReactNode;
  hideLabel?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className={hideLabel ? "sr-only" : "text-xs font-medium text-neutral-500"}>
        {label}
      </span>
      {children}
    </label>
  );
}
