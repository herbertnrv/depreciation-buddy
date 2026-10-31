import { type ExtendedAsset, type Settings, DEFAULT_SETTINGS, money, roundMoney } from './asset-model';
export type AssetInput = ExtendedAsset & { id: string; asset_number: string | null; category: string; description: string; location: string | null; purchase_date: string; purchase_price: number; rate_per_year: number; disposal_date: string | null };
export type YearSchedule = { asset: AssetInput; monthlyDepreciation: number; usefulLifeMonths: number; months: number[]; displayMonths: number[];
  openingCost: number; additions: number; disposals: number; closingCost: number; openingAccumulated: number; yearDepreciation: number;
  disposalAccumulatedRemoved: number; costRemoved: number; closingAccumulated: number; openingNBV: number; closingNBV: number;
  proceeds: number; disposalCosts: number; gainLoss: number; impairment: number; adjustment: number; status: string; category: string; costCentre: string };
export function normalizeAsset(a: AssetInput, currency = 'LAK'): AssetInput {
  const original = a.category === 'Disposed assets' ? a.notes?.match(/Original category: (.*?)\./)?.[1] : undefined;
  return { ...a, category: original || a.category, additional_costs: a.additional_costs ?? 0, residual_value: a.residual_value ?? 0,
    in_service_date: a.in_service_date || a.purchase_date, useful_life_months: a.useful_life_months ?? (a.rate_per_year > 0 ? 12 / a.rate_per_year : 0),
    method: a.method ?? (a.rate_per_year > 0 ? 'straight-line' : 'none'), declining_factor: a.declining_factor ?? 2,
    currency: a.currency || currency, exchange_rate: a.exchange_rate ?? 1, cost_centre: a.cost_centre || 'Hotel', quantity: a.quantity ?? 1,
    supplier: a.supplier || '', invoice_number: a.invoice_number || '', attachments: a.attachments || [], impairments: a.impairments || [], transfers: a.transfers || [],
    disposals_history: a.disposals_history ?? (a.disposal_date ? [{ date: a.disposal_date, fraction: 1, type: 'Sale', proceeds: Number(a.notes?.match(/Proceeds: ([\d.]+)/)?.[1] || 0), costs: 0 }] : []) };
}
export function totalCost(a: AssetInput) { return (a.purchase_price + (a.additional_costs || 0)) * (a.exchange_rate ?? 1); }
const monthIndex = (s: string) => Number(s.slice(0,4)) * 12 + Number(s.slice(5,7)) - 1;
function weight(start: string, end: string | null, y: number, m: number, convention: Settings['convention']) {
  const idx = y * 12 + m - 1, first = monthIndex(start), last = end ? monthIndex(end) : Infinity;
  if (idx < first || idx > last) return 0;
  if (convention === 'daily') {
    const days = new Date(Date.UTC(y,m,0)).getUTCDate();
    const from = idx === first ? Number(start.slice(8,10)) : 1;
    const to = end && idx === last ? Number(end.slice(8,10)) : days;
    return Math.max(0, to - from + 1) / days;
  }
  if (convention === 'mid-month') return idx === first && idx === last ? 0 : (idx === first || idx === last ? .5 : 1);
  // Full-month: acquisition month included, disposal month excluded.
  // Next-month: acquisition month excluded, disposal month included.
  if (convention === 'next-month') return idx === first ? 0 : 1;
  return idx === last ? 0 : 1;
}
export function computeYearSchedule(input: AssetInput, reportYear: number, settings: Settings = DEFAULT_SETTINGS): YearSchedule {
  const a = normalizeAsset(input, settings.reportingCurrency), cost = totalCost(a), residual = Math.min(cost, (a.residual_value || 0) * (a.exchange_rate ?? 1));
  const life = a.useful_life_months || 0, monthly = life > 0 ? (cost - residual) / life : 0;
  const events = [...(a.disposals_history || [])].sort((x,y) => x.date.localeCompare(y.date));
  const impairments = [...(a.impairments || [])].sort((x,y) => x.date.localeCompare(y.date));
  let fraction = 1, acc = 0, impairmentAcc = 0, elapsed = 0, balance = cost;
  let openingCost = 0, openingAccumulated = 0, openingNBV = 0;
  let disposals = 0, costRemoved = 0, disposalAccumulatedRemoved = 0, proceeds = 0, disposalCosts = 0, impairment = 0;
  const months = Array<number>(12).fill(0);
  const firstYear = Number(a.purchase_date.slice(0,4));
  for (let y = firstYear; y <= reportYear; y++) {
    if (y === reportYear && firstYear < reportYear) { openingCost = cost * fraction; openingAccumulated = acc + impairmentAcc; openingNBV = balance; }
    for (let m = 1; m <= 12; m++) {
      const idx = y * 12 + m - 1;
      const here = events.filter(e => monthIndex(e.date) === idx);
      let dep = 0;
      if (!a.under_construction && a.method !== 'none' && life > 0 && fraction > 0) {
        const fullWeight = weight(a.in_service_date || a.purchase_date, null, y, m, settings.convention);
        let effective = fullWeight * fraction;
        for (const e of here) effective -= e.fraction * (fullWeight - weight(a.in_service_date || a.purchase_date, e.date, y, m, settings.convention));
        const available = Math.max(0, balance - residual * fraction);
        const remainingLife = Math.max(0, life - elapsed);
        if (remainingLife > 0 && effective > 0) {
          const unitWeight = fraction > 0 ? Math.max(0,effective) / fraction : 0;
          const w = Math.min(unitWeight, remainingLife);
          const straight = available / remainingLife * w;
          dep = a.method === 'declining-balance' ? Math.max(straight, balance * (a.declining_factor || 2) / life * w) : straight;
          dep = Math.min(available, dep); elapsed += Math.min(fullWeight, remainingLife);
          if (elapsed >= life - 1e-9 && here.length === 0) dep = available;
          acc += dep; balance -= dep;
        }
      }
      if (y === reportYear) months[m-1] = dep;
      for (const e of impairments.filter(e => monthIndex(e.date) === idx)) {
        const amount = e.reversal ? -Math.min(e.amount, impairmentAcc) : Math.min(e.amount, Math.max(0,balance-residual*fraction));
        impairmentAcc += amount; balance -= amount;
        if (y === reportYear) impairment += amount;
      }
      for (const e of here) {
        const removed = Math.min(fraction, e.fraction), ratio = fraction > 0 ? removed/fraction : 0;
        const nbv = balance * ratio, removedAcc = (acc + impairmentAcc) * ratio;
        if (y === reportYear) { disposals += nbv; costRemoved += cost * removed; disposalAccumulatedRemoved += removedAcc; proceeds += e.proceeds; disposalCosts += e.costs; }
        acc *= 1-ratio; impairmentAcc *= 1-ratio; balance *= 1-ratio; fraction -= removed;
      }
    }
  }
  if (firstYear > reportYear) balance = 0;
  const additions = firstYear === reportYear ? cost : 0;
  const closingCost = firstYear <= reportYear ? cost * fraction : 0;
  const yearDepreciation = months.reduce((s,n)=>s+n,0);
  const displayMonths = months.map(n => roundMoney(n,settings.reportingCurrency));
  displayMonths[11] += roundMoney(yearDepreciation,settings.reportingCurrency) - displayMonths.reduce((s,n)=>s+n,0);
  const transfer = (a.transfers || []).filter(t=>t.date<=`${reportYear}-12-31`).sort((x,y)=>x.date.localeCompare(y.date)).at(-1);
  return { asset: a, monthlyDepreciation: monthly, usefulLifeMonths: life, months, displayMonths, openingCost, openingAccumulated, openingNBV,
    additions, disposals, costRemoved, closingCost, yearDepreciation, disposalAccumulatedRemoved, closingAccumulated: acc+impairmentAcc,
    closingNBV: Math.max(0,balance), proceeds, disposalCosts, gainLoss: proceeds-disposalCosts-disposals, impairment, adjustment: 0,
    status: fraction <= 1e-9 ? 'Disposed' : a.under_construction ? 'Under construction' : balance <= residual*fraction+1e-7 && a.method !== 'none' ? 'Fully depreciated' : 'Active',
    category: transfer?.category || a.category, costCentre: transfer?.cost_centre || a.cost_centre || 'Hotel' };
}
export const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export function formatMoney(n: number, currency = 'LAK') { return money(n,currency); }
export function scheduleVisible(s: YearSchedule) { return s.openingCost > 0 || s.additions > 0 || s.costRemoved > 0; }
