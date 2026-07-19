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

  const addFormId = "log-table-add-row";
  const editFormId = editingId ? `log-table-edit-${editingId}` : null;

  // Minimumbreedte per kolom zodat invoervelden op een smal (staand)
  // telefoonscherm nooit worden samengeperst tot ze overlappen — bij te
  // weinig ruimte scrolt de tabel horizontaal (zie overflow-x-auto) in
  // plaats van kolommen te verkleinen.
  const minTableWidth =
    128 /* Datum */ +
    columns.length * 128 +
    (extraColumnKey ? 96 : 0) /* extra kolom (bv. BMI) */ +
    160; /* Acties */

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Losstaande <form>-elementen: HTML staat geen <form> toe als omhulsel
          rond meerdere <td>'s binnen een <tr>, dus velden koppelen we via het
          form-attribuut aan een form die hier los van de tabelstructuur staat. */}
      <form id={addFormId} action={handleAdd} className="hidden" />
      {editFormId && (
        <form
          id={editFormId}
          action={(fd) => {
            if (editingId) handleUpdate(editingId, fd);
          }}
          className="hidden"
        />
      )}

      <table
        className="w-full table-fixed text-sm"
        style={{ minWidth: minTableWidth }}
      >
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <th className="w-32 px-1 py-2 font-medium">Datum</th>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 font-medium">
                {col.label}
              </th>
            ))}
            {extraColumnLabel && (
              <th className="w-24 px-3 py-2 font-medium">{extraColumnLabel}</th>
            )}
            <th className="sticky right-0 w-40 border-l border-neutral-200 bg-neutral-50 px-3 py-2 font-medium">
              Acties
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            editingId === row.id ? (
              <tr key={row.id} className="border-b border-neutral-100 bg-emerald-50/40">
                <td className="px-1 py-2">
                  <input
                    form={editFormId ?? undefined}
                    name="log_date"
                    type="date"
                    defaultValue={row.log_date}
                    required
                    className="input"
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-2 py-2">
                    <input
                      form={editFormId ?? undefined}
                      name={col.key}
                      type="text"
                      inputMode={col.type === "number" ? "decimal" : undefined}
                      defaultValue={row[col.key] ?? ""}
                      placeholder={col.placeholder ?? col.label}
                      className="input"
                    />
                  </td>
                ))}
                {extraColumnKey && (
                  <td className="px-3 py-2 text-neutral-400">
                    {row[extraColumnKey] ?? "—"}
                  </td>
                )}
                <td className="sticky right-0 whitespace-nowrap border-l border-neutral-200 bg-emerald-50 px-2 py-2">
                  <button
                    form={editFormId ?? undefined}
                    type="submit"
                    disabled={isPending}
                    className="mr-2 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
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
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="border-b border-neutral-100">
                <td className="whitespace-nowrap px-2 py-2 text-neutral-700">
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
                <td className="sticky right-0 whitespace-nowrap border-l border-neutral-100 bg-white px-3 py-2">
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
            <td className="px-1 py-2">
              <input
                form={addFormId}
                name="log_date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
                className="input"
              />
            </td>
            {columns.map((col) => (
              <td key={col.key} className="px-2 py-2">
                <input
                  form={addFormId}
                  name={col.key}
                  type="text"
                  inputMode={col.type === "number" ? "decimal" : undefined}
                  placeholder={col.placeholder ?? col.label}
                  className="input"
                />
              </td>
            ))}
            {extraColumnKey && (
              <td className="px-3 py-2 text-neutral-400">automatisch</td>
            )}
            <td className="sticky right-0 whitespace-nowrap border-l border-neutral-200 bg-neutral-50 px-2 py-2">
              <button
                form={addFormId}
                type="submit"
                disabled={isPending}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                + Toevoegen
              </button>
            </td>
          </tr>

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (extraColumnLabel ? 1 : 0) + 2}
                className="px-3 py-4 text-center text-neutral-400"
              >
                Nog geen gegevens gelogd — voeg hierboven een eerste rij toe.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
