import * as XLSX from "xlsx";

export type ParsedAsset = {
  asset_number: string | null;
  category: string;
  description: string;
  location: string | null;
  purchase_date: string; // YYYY-MM-DD
  purchase_price: number;
  rate_per_year: number; // decimal (0.2 = 20%)
};

export type ParseResult = {
  sheetName: string;
  assets: ParsedAsset[];
  skipped: number;
};

// Column indexes (0-based) matching the template:
// B(1)=category-code, C(2)=description, D(3)=location, E(4)=purchase date,
// G(6)=purchase price, O(14)=rate per year
const COL = {
  catCode: 1,
  desc: 2,
  location: 3,
  date: 4,
  price: 6,
  rate: 14,
} as const;

function toISODate(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number") {
    // Excel serial date
    const d = XLSX.SSF.parse_date_code(v);
    if (!d) return null;
    const mm = String(d.m).padStart(2, "0");
    const dd = String(d.d).padStart(2, "0");
    return `${d.y}-${mm}-${dd}`;
  }
  if (typeof v === "string") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return null;
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[, ]/g, ""));
    if (isFinite(n)) return n;
  }
  return null;
}

function toRate(v: unknown): number | null {
  const n = toNumber(v);
  if (n === null) return null;
  if (n <= 0) return null;
  // If someone wrote 20 meaning 20% — normalize.
  return n > 1 ? n / 100 : n;
}

export function parseAssetWorkbook(buffer: ArrayBuffer): ParseResult {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  // Pick the first sheet whose name contains "schedule" or "summery", else first non-empty.
  const sheetName =
    wb.SheetNames.find((n) => /schedule|summery|summary/i.test(n)) ??
    wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    blankrows: false,
    defval: null,
  });

  const assets: ParsedAsset[] = [];
  let currentCategory = "Uncategorized";
  let skipped = 0;

  for (const row of rows) {
    const catCode = row[COL.catCode];
    const desc = row[COL.desc];
    const date = row[COL.date];
    const price = row[COL.price];

    // Category header row: has a numeric code in col B and a label in col C.
    if (catCode != null && catCode !== "" && typeof desc === "string" && desc.trim()) {
      currentCategory = desc.trim();
      continue;
    }

    // Asset row: needs description + date + price.
    if (!desc || typeof desc !== "string") continue;
    const iso = toISODate(date);
    const priceNum = toNumber(price);
    const rateNum = toRate(row[COL.rate]);
    if (!iso || priceNum == null || priceNum <= 0 || rateNum == null) {
      skipped++;
      continue;
    }

    const loc = row[COL.location];
    assets.push({
      asset_number: null,
      category: currentCategory,
      description: desc.trim(),
      location: typeof loc === "string" ? loc.trim() || null : null,
      purchase_date: iso,
      purchase_price: priceNum,
      rate_per_year: rateNum,
    });
  }

  return { sheetName, assets, skipped };
}
