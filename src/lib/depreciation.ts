// Straight-line monthly depreciation engine for the fixed asset register.
//
// Monthly depreciation = purchase_price * rate_per_year / 12
// Depreciation runs from the purchase month until the asset is fully
// depreciated (accumulated depreciation reaches purchase_price) OR until
// the disposal month (inclusive of the month before disposal).
//
// For a given report year, we compute:
//   - opening NBV  (= NBV at 31.12. of prior year)
//   - 12 monthly depreciation values (Jan..Dec)
//   - disposal (if disposed within the year)
//   - closing NBV (= 31.12. of report year)

export type AssetInput = {
  id: string;
  asset_number: string | null;
  category: string;
  description: string;
  location: string | null;
  purchase_date: string; // YYYY-MM-DD
  purchase_price: number;
  rate_per_year: number; // e.g. 0.20 for 20% / year
  disposal_date: string | null;
};

export type YearSchedule = {
  asset: AssetInput;
  monthlyDepreciation: number; // theoretical monthly amount
  usefulLifeMonths: number;
  // Cumulative depreciation up to a given month end (1-12) of report year.
  // months[0] = Jan, months[11] = Dec — depreciation amount for that month only.
  months: number[];
  openingCost: number; // cost as at 1 Jan of report year (0 if not yet acquired)
  additions: number; // cost added during year (purchase price if acquired in year)
  disposals: number; // cost removed during year (purchase price if disposed in year)
  closingCost: number; // cost as at 31 Dec of report year
  openingAccumulated: number; // accumulated depr. as at 1 Jan
  yearDepreciation: number; // sum of months[]
  disposalAccumulatedRemoved: number; // accumulated depr removed on disposal
  closingAccumulated: number; // accumulated depr. as at 31 Dec
  openingNBV: number;
  closingNBV: number;
};

const parseYMD = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return { year: y, month: m, day: d }; // month 1..12
};

// Number of depreciation months from purchase up to and including (year, month).
// Returns 0 if (year, month) is before purchase month.
function monthsElapsed(
  purchaseYear: number,
  purchaseMonth: number,
  year: number,
  month: number,
): number {
  const diff = (year - purchaseYear) * 12 + (month - purchaseMonth) + 1;
  return Math.max(0, diff);
}

export function computeYearSchedule(
  asset: AssetInput,
  reportYear: number,
): YearSchedule {
  const p = parseYMD(asset.purchase_date);
  const disposal = asset.disposal_date ? parseYMD(asset.disposal_date) : null;

  const monthly = (asset.purchase_price * asset.rate_per_year) / 12;
  const usefulLifeMonths =
    asset.rate_per_year > 0 ? Math.round(12 / asset.rate_per_year) : 0;

  // Accumulated depreciation through a given (year, month-end), capped by cost
  // and stopped at disposal month (depreciation runs up to month BEFORE disposal).
  const accumulatedThrough = (year: number, month: number): number => {
    let elapsed = monthsElapsed(p.year, p.month, year, month);
    if (disposal) {
      // Depreciation runs through the month before disposal (i.e. last full month).
      const lastDeprMonth = monthsElapsed(
        p.year,
        p.month,
        disposal.year,
        disposal.month,
      ) - 1;
      elapsed = Math.min(elapsed, Math.max(0, lastDeprMonth));
    }
    elapsed = Math.min(elapsed, usefulLifeMonths || elapsed);
    const acc = monthly * elapsed;
    return Math.min(acc, asset.purchase_price);
  };

  const acquiredInYear = p.year === reportYear;
  const disposedInYear = !!disposal && disposal.year === reportYear;
  const acquiredBeforeOrIn = p.year <= reportYear;

  const openingCost =
    acquiredBeforeOrIn && p.year < reportYear ? asset.purchase_price : 0;
  const additions = acquiredInYear ? asset.purchase_price : 0;
  const disposals = disposedInYear ? asset.purchase_price : 0;
  const closingCost = openingCost + additions - disposals;

  const openingAccumulated = accumulatedThrough(reportYear - 1, 12);

  const months: number[] = [];
  let prevAcc = openingAccumulated;
  for (let m = 1; m <= 12; m++) {
    const acc = accumulatedThrough(reportYear, m);
    months.push(Math.max(0, acc - prevAcc));
    prevAcc = acc;
  }
  const yearDepreciation = months.reduce((s, v) => s + v, 0);

  // On disposal we remove accumulated depreciation that belonged to this asset.
  const disposalAccumulatedRemoved = disposedInYear
    ? openingAccumulated + yearDepreciation
    : 0;

  const closingAccumulated =
    openingAccumulated + yearDepreciation - disposalAccumulatedRemoved;

  const openingNBV = openingCost - openingAccumulated;
  const closingNBV = closingCost - closingAccumulated;

  return {
    asset,
    monthlyDepreciation: monthly,
    usefulLifeMonths,
    months,
    openingCost,
    additions,
    disposals,
    closingCost,
    openingAccumulated,
    yearDepreciation,
    disposalAccumulatedRemoved,
    closingAccumulated,
    openingNBV,
    closingNBV,
  };
}

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatMoney(n: number): string {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
