"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/layout/page-states";

export type DataTableColumnDef = {
  id: string;
  header: string;
};

export type DataTableRow = {
  id: string;
  cells: Record<string, string>;
  detailHref?: string;
};

export function DataTable({
  caption,
  columns,
  rows,
  emptyMessage = "No data",
  pageSize = 8,
}: {
  caption: string;
  columns: DataTableColumnDef[];
  rows: DataTableRow[];
  emptyMessage?: string;
  pageSize?: number;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map((c) => [c.id, true])),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let data = rows;
    if (q) {
      data = data.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(q),
      );
    }
    if (sortBy) {
      data = [...data].sort((a, b) => {
        const av = a.cells[sortBy] ?? "";
        const bv = b.cells[sortBy] ?? "";
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [rows, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeColumns = columns.filter((c) => visible[c.id]);

  function toggleSort(id: string) {
    if (sortBy === id) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(id);
      setSortDir("asc");
    }
  }

  if (rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <Input
          aria-label="Search table"
          placeholder="Search…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          {columns.map((c) => (
            <label key={c.id} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={visible[c.id]}
                onChange={() =>
                  setVisible((v) => ({ ...v, [c.id]: !v[c.id] }))
                }
              />
              {c.header}
            </label>
          ))}
        </div>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={caption}>
        {pageRows.map((row) => (
          <li
            key={row.id}
            className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
          >
            <dl className="space-y-2 text-sm">
              {activeColumns.map((col) => (
                <div key={col.id}>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    {col.header}
                  </dt>
                  <dd className="text-slate-900">{row.cells[col.id]}</dd>
                </div>
              ))}
            </dl>
            {row.detailHref ? (
              <Link
                href={row.detailHref}
                className="mt-3 inline-block text-sm font-medium text-cyan-800 underline"
              >
                Details
              </Link>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-md border border-slate-200 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {activeColumns.map((col) => (
                <th key={col.id} scope="col" className="px-3 py-2">
                  <button
                    type="button"
                    className="font-semibold hover:text-slate-900"
                    onClick={() => toggleSort(col.id)}
                  >
                    {col.header}
                    {sortBy === col.id ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-3 py-2">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                {activeColumns.map((col) => (
                  <td key={col.id} className="px-3 py-2 text-slate-800">
                    {row.cells[col.id]}
                  </td>
                ))}
                <td className="px-3 py-2">
                  {row.detailHref ? (
                    <Link
                      href={row.detailHref}
                      className="font-medium text-cyan-800 underline"
                    >
                      Open
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {filtered.length} rows · page {page}/{totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
