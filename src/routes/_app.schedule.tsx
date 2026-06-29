import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useAssets } from "@/lib/use-assets";
import {
  computeYearSchedule,
  formatMoney,
  MONTH_LABELS,
  type YearSchedule,
} from "@/lib/depreciation";
import {
  exportToExcel,
  exportToPDF,
  exportSummaryPDF,
  computeSummaryTotals,
} from "@/lib/export-schedule";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

const SORT_KEYS = [
  "asset_number",
  "description",
  "location",
  "purchase_date",
  "costPurchase",
  "openingNBV",
  "additions",
  "disposals",
  "yearDepreciation",
  "closingNBV",
  "rate",
  "monthly",
  "m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11","m12",
  "closingAccumulated",
] as const;
type SortKey = (typeof SORT_KEYS)[number];
type SortDir = "asc" | "desc";

const searchSchema = z.object({
  year: z.coerce.number().int().min(1990).max(2100).catch(new Date().getFullYear()),
  sort: z.enum(SORT_KEYS).catch("purchase_date"),
  dir: z.enum(["asc", "desc"]).catch("asc"),
  category: z.string().optional().catch(undefined),
  catDir: z.enum(["asc", "desc"]).catch("asc"),
});

export const Route = createFileRoute("/_app/schedule")({
  validateSearch: searchSchema,
  component: SchedulePage,
});

function valueFor(s: YearSchedule, key: SortKey): string | number {
  switch (key) {
    case "asset_number": return s.asset.asset_number ?? "";
    case "description": return s.asset.description ?? "";
    case "location": return s.asset.location ?? "";
    case "purchase_date": return s.asset.purchase_date ?? "";
    case "costPurchase": return s.asset.purchase_price;
    case "openingNBV": return s.openingNBV;
    case "additions": return s.additions;
    case "disposals": return s.disposals;
    case "yearDepreciation": return s.yearDepreciation;
    case "closingNBV": return s.closingNBV;
    case "rate": return s.asset.rate_per_year;
    case "monthly": return s.monthlyDepreciation;
    case "closingAccumulated": return s.closingAccumulated;
    default:
      if (key.startsWith("m")) {
        const idx = Number(key.slice(1)) - 1;
        return s.months[idx] ?? 0;
      }
      return "";
  }
}

function compare(a: YearSchedule, b: YearSchedule, key: SortKey, dir: SortDir): number {
  const av = valueFor(a, key);
  const bv = valueFor(b, key);
  let r: number;
  if (typeof av === "number" && typeof bv === "number") r = av - bv;
  else r = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
  return dir === "asc" ? r : -r;
}

function SchedulePage() {
  const { year, sort, dir, category, catDir } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: assets, isLoading, error } = useAssets();

  const allSchedules = useMemo<YearSchedule[]>(() => {
    if (!assets) return [];
    return assets
      .map((a) => computeYearSchedule(a, year))
      .filter((s) => s.openingCost > 0 || s.additions > 0 || s.disposals > 0);
  }, [assets, year]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const s of allSchedules) set.add(s.asset.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allSchedules]);

  const schedules = useMemo<YearSchedule[]>(
    () =>
      category && category !== "__all__"
        ? allSchedules.filter((s) => s.asset.category === category)
        : allSchedules,
    [allSchedules, category],
  );

  const groups = useMemo<[string, YearSchedule[]][]>(() => {
    const map = new Map<string, YearSchedule[]>();
    for (const s of schedules) {
      const arr = map.get(s.asset.category) ?? [];
      arr.push(s);
      map.set(s.asset.category, arr);
    }
    const sorted = Array.from(map.entries()).sort(([a], [b]) =>
      catDir === "asc" ? a.localeCompare(b) : b.localeCompare(a),
    );
    for (const [, rows] of sorted) {
      rows.sort((a, b) => compare(a, b, sort, dir));
    }
    return sorted;
  }, [schedules, sort, dir, catDir]);

  const totals = useMemo(() => totalsOf(schedules), [schedules]);
  const monthlyTotals = useMemo(() => {
    const out = Array(12).fill(0);
    for (const s of schedules) for (let i = 0; i < 12; i++) out[i] += s.months[i];
    return out as number[];
  }, [schedules]);

  type Search = z.infer<typeof searchSchema>;
  const setYear = (delta: number) =>
    navigate({ search: (prev: Search) => ({ ...prev, year: prev.year + delta }) });

  const setCategory = (val: string) =>
    navigate({ search: (prev: Search) => ({ ...prev, category: val === "__all__" ? undefined : val }) });

  const setCatDir = (val: "asc" | "desc") =>
    navigate({ search: (prev: Search) => ({ ...prev, catDir: val }) });

  const toggleSort = (key: SortKey) =>
    navigate({
      search: (prev: Search) => {
        if (prev.sort === key) {
          return { ...prev, dir: prev.dir === "asc" ? "desc" : "asc" };
        }
        return { ...prev, sort: key, dir: "asc" };
      },
    });

  const SortHead = ({
    k,
    children,
    align = "left",
    className = "",
  }: {
    k: SortKey;
    children: React.ReactNode;
    align?: "left" | "right";
    className?: string;
  }) => {
    const active = sort === k;
    const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <th className={`p-0 font-medium ${className}`}>
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className={`w-full h-full px-2 py-2 flex items-center gap-1 hover:text-foreground transition-colors ${
            align === "right" ? "justify-end" : "justify-start"
          } ${active ? "text-foreground" : ""}`}
          title={`Sort by ${String(children)}`}
        >
          {align === "right" && <Icon className={`h-3 w-3 ${active ? "" : "opacity-40"}`} />}
          <span>{children}</span>
          {align === "left" && <Icon className={`h-3 w-3 ${active ? "" : "opacity-40"}`} />}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Depreciation Schedule — {year}
          </h2>
          <p className="text-sm text-muted-foreground">
            Click any column header to sort. Exports follow the current sort order.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Category</span>
            <Select value={category ?? "__all__"} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={catDir} onValueChange={(v) => setCatDir(v as "asc" | "desc")}>
              <SelectTrigger className="w-[120px] h-9" title="Category order">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">A → Z</SelectItem>
                <SelectItem value="desc">Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(groups, year)}
            disabled={schedules.length === 0}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToPDF(groups, year)}
            disabled={schedules.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportSummaryPDF(groups, year)}
            disabled={schedules.length === 0}
            title="Einseitige Zusammenfassung A4 quer"
          >
            <FileText className="h-4 w-4 mr-2" /> Summary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            disabled={schedules.length === 0}
          >
            Print
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <Button variant="outline" size="icon" onClick={() => setYear(-1)} aria-label="Previous year">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 rounded-md border border-border bg-card font-mono text-sm min-w-[80px] text-center">
              {year}
            </div>
            <Button variant="outline" size="icon" onClick={() => setYear(1)} aria-label="Next year">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-destructive">Failed to load assets.</p>}

      {!isLoading && schedules.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No assets active in {year}.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add assets in the "Assets" tab to populate the schedule.
          </p>
        </div>
      )}

      {schedules.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="border-b border-border">
                <SortHead k="asset_number" className="sticky left-0 bg-muted/50 z-10 min-w-[80px]">Inv #</SortHead>
                <SortHead k="description" className="min-w-[180px]">Description</SortHead>
                <SortHead k="location">Location</SortHead>
                <SortHead k="purchase_date">Purchased</SortHead>
                <SortHead k="costPurchase" align="right">Cost purchase</SortHead>
                <SortHead k="openingNBV" align="right" className="border-l border-border">NBV 01.01</SortHead>
                <SortHead k="additions" align="right" className="text-emerald-600 dark:text-emerald-400">Additions</SortHead>
                <SortHead k="disposals" align="right" className="text-red-600 dark:text-red-400">Disposals</SortHead>
                <SortHead k="yearDepreciation" align="right">Annual Depr.</SortHead>
                <SortHead k="closingNBV" align="right" className="border-r border-border">NBV 31.12</SortHead>
                <SortHead k="rate" align="right">Rate</SortHead>
                <SortHead k="monthly" align="right">Monthly</SortHead>
                {MONTH_LABELS.map((m, i) => (
                  <SortHead key={m} k={`m${i + 1}` as SortKey} align="right">{m}</SortHead>
                ))}
                <SortHead k="closingAccumulated" align="right" className="border-l border-border">Acc. Depr. 31.12</SortHead>
              </tr>
            </thead>
            <tbody>
              {groups.map(([category, rows]) => {
                const sub = totalsOf(rows);
                const subMonthly = Array(12).fill(0) as number[];
                for (const r of rows) for (let i = 0; i < 12; i++) subMonthly[i] += r.months[i];
                return (
                  <FragmentGroup key={category} category={category}>
                    {rows.map((s) => (
                      <tr key={s.asset.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-2 sticky left-0 bg-card z-10 font-mono text-[10px]">
                          {s.asset.asset_number ?? "—"}
                        </td>
                        <td className="p-2 font-medium text-foreground">{s.asset.description}</td>
                        <td className="p-2 text-muted-foreground">{s.asset.location ?? "—"}</td>
                        <td className="p-2 font-mono text-[10px]">
                          {s.asset.purchase_date}
                          {s.asset.disposal_date && (
                            <div className="text-muted-foreground">disp. {s.asset.disposal_date}</div>
                          )}
                        </td>
                        <td className="text-right p-2 font-mono">{formatMoney(s.asset.purchase_price)}</td>
                        <td className="text-right p-2 font-mono border-l border-border">{formatMoney(s.openingNBV)}</td>
                        <td className="text-right p-2 font-mono text-emerald-600 dark:text-emerald-400">{formatMoney(s.additions)}</td>
                        <td className="text-right p-2 font-mono text-red-600 dark:text-red-400">{formatMoney(s.disposals)}</td>
                        <td className="text-right p-2 font-mono font-semibold">{formatMoney(s.yearDepreciation)}</td>
                        <td className="text-right p-2 font-mono font-semibold border-r border-border">{formatMoney(s.closingNBV)}</td>
                        <td className="text-right p-2 font-mono text-muted-foreground">
                          {(s.asset.rate_per_year * 100).toFixed(1)}%
                        </td>
                        <td className="text-right p-2 font-mono text-muted-foreground">{formatMoney(s.monthlyDepreciation)}</td>
                        {s.months.map((m, i) => (
                          <td key={i} className="text-right p-2 font-mono">{formatMoney(m)}</td>
                        ))}
                        <td className="text-right p-2 font-mono border-l border-border">{formatMoney(s.closingAccumulated)}</td>
                      </tr>
                    ))}
                    <SubtotalRow label={`Subtotal — ${category}`} totals={sub} monthly={subMonthly} tone="muted" />
                  </FragmentGroup>
                );
              })}

              <SubtotalRow label="GRAND TOTAL" totals={totals} monthly={monthlyTotals} tone="grand" />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FragmentGroup({
  category,
  children,
}: {
  category: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr className="bg-secondary/60">
        <td colSpan={25} className="p-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground sticky left-0">
          {category}
        </td>
      </tr>
      {children}
    </>
  );
}

function totalsOf(rows: YearSchedule[]) {
  return rows.reduce(
    (acc, r) => ({
      costPurchase: acc.costPurchase + r.asset.purchase_price,
      openingNBV: acc.openingNBV + r.openingNBV,
      additions: acc.additions + r.additions,
      disposals: acc.disposals + r.disposals,
      yearDepreciation: acc.yearDepreciation + r.yearDepreciation,
      closingNBV: acc.closingNBV + r.closingNBV,
      closingAccumulated: acc.closingAccumulated + r.closingAccumulated,
    }),
    {
      costPurchase: 0,
      openingNBV: 0,
      additions: 0,
      disposals: 0,
      yearDepreciation: 0,
      closingNBV: 0,
      closingAccumulated: 0,
    },
  );
}

function SubtotalRow({
  label,
  totals,
  monthly,
  tone,
}: {
  label: string;
  totals: ReturnType<typeof totalsOf>;
  monthly: number[];
  tone: "muted" | "grand";
}) {
  const bg = tone === "grand" ? "bg-primary/10 font-bold" : "bg-muted/40 font-semibold";
  return (
    <tr className={`${bg} border-b border-border`}>
      <td className={`p-2 ${bg}`} />
      <td className={`p-2 text-foreground ${bg}`} colSpan={3}>{label}</td>
      <td className="text-right p-2 font-mono">{formatMoney(totals.costPurchase)}</td>
      <td className="text-right p-2 font-mono border-l border-border">{formatMoney(totals.openingNBV)}</td>
      <td className="text-right p-2 font-mono text-emerald-700 dark:text-emerald-300">{formatMoney(totals.additions)}</td>
      <td className="text-right p-2 font-mono text-red-700 dark:text-red-300">{formatMoney(totals.disposals)}</td>
      <td className="text-right p-2 font-mono">{formatMoney(totals.yearDepreciation)}</td>
      <td className="text-right p-2 font-mono border-r border-border">{formatMoney(totals.closingNBV)}</td>
      <td />
      <td />
      {monthly.map((m, i) => (
        <td key={i} className="text-right p-2 font-mono">{formatMoney(m)}</td>
      ))}
      <td className="text-right p-2 font-mono border-l border-border">{formatMoney(totals.closingAccumulated)}</td>
    </tr>
  );
}
