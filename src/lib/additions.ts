import { normalizeAsset, totalCost, type AssetInput } from './depreciation';

export function additionsForYear(assets: AssetInput[], year: number) {
  return assets.filter(a => Number(a.purchase_date.slice(0, 4)) === year)
    .map(a => normalizeAsset(a))
    .sort((a, b) => a.purchase_date.localeCompare(b.purchase_date) || a.category.localeCompare(b.category) || a.description.localeCompare(b.description));
}

export function annualAdditions(assets: AssetInput[]) {
  const totals = new Map<number, { year: number; count: number; total: number }>();
  for (const input of assets) {
    const year = Number(input.purchase_date.slice(0, 4));
    if (!Number.isInteger(year) || year < 1900 || year > 9999) continue;
    const row = totals.get(year) ?? { year, count: 0, total: 0 };
    row.count++;
    row.total += totalCost(normalizeAsset(input));
    totals.set(year, row);
  }
  return [...totals.values()].sort((a, b) => b.year - a.year);
}