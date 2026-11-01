import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Download, FileText, Printer } from 'lucide-react';
import { useAssets } from '@/lib/use-assets';
import { useSettings } from '@/lib/settings-context';
import { useT } from '@/lib/i18n';
import { additionsForYear, annualAdditions } from '@/lib/additions';
import { additionsPDF, exportAdditionsExcel } from '@/lib/additions-export';
import { totalCost } from '@/lib/depreciation';
import { dateLabel, money } from '@/lib/asset-model';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/_app/additions')({
  validateSearch: z.object({ year: z.coerce.number().int().min(1900).max(9999).optional() }),
  head: () => ({ meta: [
    { title: 'GastronoAssets | Annual additions' },
    { name: 'description', content: 'All fixed asset acquisitions by purchase year, with annual totals and local PDF and Excel reports.' },
    { property: 'og:title', content: 'GastronoAssets | Annual additions' },
    { property: 'og:description', content: 'Annual acquisition totals and detailed offline asset additions reports.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AdditionsPage,
});

function AdditionsPage() {
  const { year: selected } = Route.useSearch(), navigate = Route.useNavigate();
  const year = selected ?? new Date().getFullYear();
  const { data: assets = [], isLoading, isError } = useAssets();
  const { settings } = useSettings(), t = useT();
  const overview = annualAdditions(assets), rows = additionsForYear(assets, year);
  const years = [...new Set([new Date().getFullYear(), year, ...overview.map(r => r.year)])].sort((a, b) => b - a);
  const chooseYear = (value: number) => void navigate({ search: { year: value } });
  const total = rows.reduce((sum, a) => sum + totalCost(a), 0);
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold">{t('Annual additions')}</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={!rows.length} onClick={() => additionsPDF(assets, year, settings).save(`asset-additions-${year}.pdf`)}><FileText className="size-4" />PDF</Button>
        <Button variant="outline" disabled={isLoading || isError} onClick={() => exportAdditionsExcel(assets, year, settings)}><Download className="size-4" />Excel</Button>
        <Button variant="outline" disabled={!rows.length} onClick={() => { const doc = additionsPDF(assets, year, settings); doc.autoPrint(); window.open(doc.output('bloburl'), '_blank'); }}><Printer className="size-4" />{t('Print')}</Button>
      </div>
    </div>
    {isLoading ? <p>{t('Loading…')}</p> : isError ? <p className="text-destructive">{t('Failed to load assets.')}</p> : <>
      <section className="space-y-3" aria-label={t('Year summary')}>
        <h3 className="font-semibold">{t('Year summary')}</h3>
        <div className="overflow-auto border border-border rounded-md">
          <table className="w-full text-sm"><thead className="bg-muted"><tr><th className="p-3 text-left">{t('Financial year')}</th><th className="p-3 text-right">{t('Number of assets')}</th><th className="p-3 text-right">{t('Total cost')} ({settings.reportingCurrency})</th></tr></thead>
            <tbody>{overview.map(r => <tr key={r.year} className={`border-t border-border ${year === r.year ? 'bg-accent' : ''}`}><td className="px-3"><Button variant="link" className="px-0" onClick={() => chooseYear(r.year)} aria-pressed={year === r.year}>{r.year}</Button></td><td className="p-3 text-right tabular-nums">{r.count}</td><td className="p-3 text-right font-mono">{money(r.total, settings.reportingCurrency)}</td></tr>)}</tbody>
          </table>
          {!overview.length && <p className="p-3 text-muted-foreground">{t('No assets yet')}</p>}
        </div>
      </section>
      <section className="space-y-3" aria-label={`${t('Additions')} ${year}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><Label htmlFor="addition-year">{t('Financial year')}</Label><Select value={String(year)} onValueChange={v => chooseYear(Number(v))}><SelectTrigger id="addition-year" className="w-28"><SelectValue /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select></div>
          <p className="text-sm text-muted-foreground">{t('Number of assets')}: {rows.length} · {settings.reportingCurrency}</p>
        </div>
        <div className="max-h-[65vh] overflow-auto rounded-md border border-border">
          <table className="w-full text-sm"><thead className="sticky top-0 bg-muted"><tr>{['Category', 'Asset number', 'Description', 'Purchase date', 'Location', 'Cost centre', 'Total cost'].map(label => <th key={label} className={`p-3 whitespace-nowrap ${label === 'Total cost' ? 'text-right' : 'text-left'}`}>{t(label)}</th>)}</tr></thead>
            <tbody>{rows.map(a => <tr key={a.id} className="border-t border-border even:bg-muted/30"><td className="p-3">{a.category}</td><td className="p-3 whitespace-nowrap">{a.asset_number || '–'}</td><td className="p-3 min-w-48 font-medium">{a.description}</td><td className="p-3 whitespace-nowrap">{dateLabel(a.purchase_date)}</td><td className="p-3">{a.location || '–'}</td><td className="p-3">{a.cost_centre || '–'}</td><td className="p-3 text-right font-mono whitespace-nowrap">{money(totalCost(a), settings.reportingCurrency)}</td></tr>)}</tbody>
            <tfoot className="bg-muted font-semibold"><tr><td className="p-3" colSpan={6}>{t('TOTAL')} {year}</td><td className="p-3 text-right font-mono whitespace-nowrap">{money(total, settings.reportingCurrency)}</td></tr></tfoot>
          </table>
        </div>
        {!rows.length && <p className="text-muted-foreground">{t('No additions in this year')}</p>}
      </section>
    </>}
  </div>;
}