import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo } from "react";
import { useAssets } from "@/lib/use-assets";
import {
  computeYearSchedule,
  formatMoney,
  MONTH_LABELS,
  type YearSchedule,
} from "@/lib/depreciation";
import { exportToExcel, exportToPDF } from "@/lib/export-schedule";
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
  "openingCost",
  "additions",
  "disposals",
  "closingCost",
  "rate",
  "monthly",
  "m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11","m12",
  "yearDepreciation",
  "closingAccumulated",
  "openingNBV",
  "closingNBV",
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
    case "openingCost": return s.openingCost;
    case "additions": return s.additions;
    case "disposals": return s.disposals;
    case "closingCost": return s.closingCost;
    case "rate": return s.asset.rate_per_year;
    case "monthly": return s.monthlyDepreciation;
    case "yearDepreciation": return s.yearDepreciation;
    case "closingAccumulated": return s.closingAccumulated;
    case "openingNBV": return s.openingNBV;
    case "closingNBV": return s.closingNBV;
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
  const { year, sort, dir } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: assets, isLoading, error } = useAssets();

  const schedules = useMemo<YearSchedule[]>(() => {
    if (!assets) return [];
    return assets
      .map((a) => computeYearSchedule(a, year))
      .filter((s) => s.openingCost > 0 || s.additions > 0 || s.disposals > 0);
  }, [assets, year]);

  const groups = useMemo<[string, YearSchedule[]][]>(() => {
    const map = new Map<string, YearSchedule[]>();
    for (const s of schedules) {
      const arr = map.get(s.asset.category) ?? [];
      arr.push(s);
      map.set(s.asset.category, arr);
    }
    const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    for (const [, rows] of sorted) {
      rows.sort((a, b) => compare(a, b, sort, dir));
    }
    return sorted;
  }, [schedules, sort, dir]);

  const totals = useMemo(() => totalsOf(schedules), [schedules]);
  const monthlyTotals = useMemo(() => {
    const out = Array(12).fill(0);
    for (const s of schedules) for (let i = 0; i < 12; i++) out[i] += s.months[i];
    return out as number[];
  }, [schedules]);

  type Search = z.infer<typeof searchSchema>;
  const setYear = (delta: number) =>
    navigate({ search: (prev: Search) => ({ ...prev, year: prev.year + delta }) });

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
                <SortHead k="openingCost" align="right">Cost 01.01</SortHead>
                <SortHead k="additions" align="right" className="text-emerald-600 dark:text-emerald-400">Additions</SortHead>
                <SortHead k="disposals" align="right" className="text-red-600 dark:text-red-400">Disposals</SortHead>
                <SortHead k="closingCost" align="right">Cost 31.12</SortHead>
                <SortHead k="rate" align="right">Rate</SortHead>
                <SortHead k="monthly" align="right">Monthly</SortHead>
                {MONTH_LABELS.map((m, i) => (
                  <SortHead key={m} k={`m${i + 1}` as SortKey} align="right">{m}</SortHead>
                ))}
                <SortHead k="yearDepreciation" align="right" className="border-l border-border">Year Depr.</SortHead>
                <SortHead k="closingAccumulated" align="right">Acc. Depr. 31.12</SortHead>
                <SortHead k="openingNBV" align="right" className="border-l border-border">NBV 01.01</SortHead>
                <SortHead k="closingNBV" align="right">NBV 31.12</SortHead>
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
                        <td className="text-right p-2 font-mono">{formatMoney(s.openingCost)}</td>
                        <td className="text-right p-2 font-mono text-emerald-600 dark:text-emerald-400">{formatMoney(s.additions)}</td>
                        <td className="text-right p-2 font-mono text-red-600 dark:text-red-400">{formatMoney(s.disposals)}</td>
                        <td className="text-right p-2 font-mono">{formatMoney(s.closingCost)}</td>
                        <td className="text-right p-2 font-mono text-muted-foreground">
                          {(s.asset.rate_per_year * 100).toFixed(1)}%
                        </td>
                        <td className="text-right p-2 font-mono text-muted-foreground">{formatMoney(s.monthlyDepreciation)}</td>
                        {s.months.map((m, i) => (
                          <td key={i} className="text-right p-2 font-mono">{formatMoney(m)}</td>
                        ))}
                        <td className="text-right p-2 font-mono border-l border-border font-semibold">{formatMoney(s.yearDepreciation)}</td>
                        <td className="text-right p-2 font-mono">{formatMoney(s.closingAccumulated)}</td>
                        <td className="text-right p-2 font-mono border-l border-border">{formatMoney(s.openingNBV)}</td>
                        <td className="text-right p-2 font-mono font-semibold">{formatMoney(s.closingNBV)}</td>
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
        <td colSpan={23} className="p-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground sticky left-0">
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
      openingCost: acc.openingCost + r.openingCost,
      additions: acc.additions + r.additions,
      disposals: acc.disposals + r.disposals,
      closingCost: acc.closingCost + r.closingCost,
      yearDepreciation: acc.yearDepreciation + r.yearDepreciation,
      closingAccumulated: acc.closingAccumulated + r.closingAccumulated,
      openingNBV: acc.openingNBV + r.openingNBV,
      closingNBV: acc.closingNBV + r.closingNBV,
    }),
    {
      openingCost: 0,
      additions: 0,
      disposals: 0,
      closingCost: 0,
      yearDepreciation: 0,
      closingAccumulated: 0,
      openingNBV: 0,
      closingNBV: 0,
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
      <td className="text-right p-2 font-mono">{formatMoney(totals.openingCost)}</td>
      <td className="text-right p-2 font-mono text-emerald-700 dark:text-emerald-300">{formatMoney(totals.additions)}</td>
      <td className="text-right p-2 font-mono text-red-700 dark:text-red-300">{formatMoney(totals.disposals)}</td>
      <td className="text-right p-2 font-mono">{formatMoney(totals.closingCost)}</td>
      <td />
      <td />
      {monthly.map((m, i) => (
        <td key={i} className="text-right p-2 font-mono">{formatMoney(m)}</td>
      ))}
      <td className="text-right p-2 font-mono border-l border-border">{formatMoney(totals.yearDepreciation)}</td>
      <td className="text-right p-2 font-mono">{formatMoney(totals.closingAccumulated)}</td>
      <td className="text-right p-2 font-mono border-l border-border">{formatMoney(totals.openingNBV)}</td>
      <td className="text-right p-2 font-mono">{formatMoney(totals.closingNBV)}</td>
    </tr>
  );
}
