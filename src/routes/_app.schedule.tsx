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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const searchSchema = z.object({
  year: z.coerce.number().int().min(1990).max(2100).catch(new Date().getFullYear()),
});

export const Route = createFileRoute("/_app/schedule")({
  validateSearch: searchSchema,
  component: SchedulePage,
});

function SchedulePage() {
  const { year } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: assets, isLoading, error } = useAssets();

  const schedules = useMemo<YearSchedule[]>(() => {
    if (!assets) return [];
    return assets
      .map((a) => computeYearSchedule(a, year))
      // hide assets not yet acquired AND fully written off before this year
      .filter((s) => s.openingCost > 0 || s.additions > 0 || s.disposals > 0);
  }, [assets, year]);

  const groups = useMemo(() => {
    const map = new Map<string, YearSchedule[]>();
    for (const s of schedules) {
      const arr = map.get(s.asset.category) ?? [];
      arr.push(s);
      map.set(s.asset.category, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [schedules]);

  const totals = useMemo(() => totalsOf(schedules), [schedules]);
  const monthlyTotals = useMemo(() => {
    const out = Array(12).fill(0);
    for (const s of schedules) for (let i = 0; i < 12; i++) out[i] += s.months[i];
    return out as number[];
  }, [schedules]);

  const setYear = (delta: number) =>
    navigate({ search: (prev: { year: number }) => ({ ...prev, year: prev.year + delta }) });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Depreciation Schedule — {year}
          </h2>
          <p className="text-sm text-muted-foreground">
            Opening balances roll forward automatically from {year - 1}.
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-destructive">Failed to load assets.</p>}

      {!isLoading && schedules.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No assets active in {year}.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add assets in the “Assets” tab to populate the schedule.
          </p>
        </div>
      )}

      {schedules.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left p-2 font-medium sticky left-0 bg-muted/50 z-10 min-w-[200px]">Asset</th>
                <th className="text-right p-2 font-medium">Cost 01.01</th>
                <th className="text-right p-2 font-medium text-emerald-600 dark:text-emerald-400">Additions</th>
                <th className="text-right p-2 font-medium text-red-600 dark:text-red-400">Disposals</th>
                <th className="text-right p-2 font-medium">Cost 31.12</th>
                <th className="text-right p-2 font-medium">Rate</th>
                <th className="text-right p-2 font-medium">Monthly</th>
                {MONTH_LABELS.map((m) => (
                  <th key={m} className="text-right p-2 font-medium">{m}</th>
                ))}
                <th className="text-right p-2 font-medium border-l border-border">Year Depr.</th>
                <th className="text-right p-2 font-medium">Acc. Depr. 31.12</th>
                <th className="text-right p-2 font-medium border-l border-border">NBV 01.01</th>
                <th className="text-right p-2 font-medium font-semibold">NBV 31.12</th>
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
                        <td className="p-2 sticky left-0 bg-card z-10">
                          <div className="font-medium text-foreground">{s.asset.description}</div>
                          <div className="text-muted-foreground text-[10px]">
                            {s.asset.asset_number ?? "—"} · {s.asset.purchase_date}
                            {s.asset.disposal_date && ` · disposed ${s.asset.disposal_date}`}
                          </div>
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
        <td colSpan={20} className="p-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground sticky left-0">
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
      <td className={`p-2 text-foreground sticky left-0 ${bg}`}>{label}</td>
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
