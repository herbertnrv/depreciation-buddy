import { describe, expect, it } from 'vitest';
import { additionsForYear, annualAdditions } from './additions';
import type { AssetInput } from './depreciation';

const asset: AssetInput = { id: 'a', category: 'Equipment', description: 'Oven', asset_number: null, location: null, purchase_date: '2026-03-15', purchase_price: 100000000, rate_per_year: .2, disposal_date: null };
describe('Annual additions', () => {
  it('shows every acquisition in the selected purchase year only, sorted by date', () => {
    const rows = additionsForYear([asset, { ...asset, id: 'prior', purchase_date: '2025-12-31' }, { ...asset, id: 'early', purchase_date: '2026-01-01' }, { ...asset, id: 'later', purchase_date: '2027-01-01' }], 2026);
    expect(rows.map(a => a.id)).toEqual(['early', 'a']);
  });
  it('includes disposed and under-construction acquisitions, regardless of in-service year', () => {
    const rows = additionsForYear([{ ...asset, id: 'sold', disposal_date: '2026-07-01' }, { ...asset, id: 'construction', under_construction: true, in_service_date: '2027-01-01' }], 2026);
    expect(rows.map(a => a.id).sort()).toEqual(['construction', 'sold']);
  });
  it('totals acquisition extras and exchange rates with sensible legacy defaults', () => {
    expect(annualAdditions([asset, { ...asset, id: 'foreign', purchase_price: 100, additional_costs: 20, exchange_rate: 20000 }, { ...asset, id: 'prior', purchase_date: '2025-12-31' }])).toEqual([
      { year: 2026, count: 2, total: 102400000 }, { year: 2025, count: 1, total: 100000000 },
    ]);
  });
});