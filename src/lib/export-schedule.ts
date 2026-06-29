import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MONTH_LABELS, type YearSchedule } from "./depreciation";

type Row = {
  category: string;
  isSubtotal?: boolean;
  isGrand?: boolean;
  inv: string;
  description: string;
  location: string;
  purchase: string;
  costPurchase: number;
  openingNBV: number;
  additions: number;
  disposals: number;
  yearDepreciation: number;
  closingNBV: number;
  rate: string;
  monthly: number;
  months: number[];
  closingAccumulated: number;
};

function zeros() {
  return {
    costPurchase: 0,
    openingNBV: 0,
    additions: 0,
    disposals: 0,
    yearDepreciation: 0,
    closingNBV: 0,
    closingAccumulated: 0,
    months: Array(12).fill(0) as number[],
  };
}

function addInto(acc: ReturnType<typeof zeros>, s: YearSchedule) {
  acc.costPurchase += s.asset.purchase_price;
  acc.openingNBV += s.openingNBV;
  acc.additions += s.additions;
  acc.disposals += s.disposals;
  acc.yearDepreciation += s.yearDepreciation;
  acc.closingNBV += s.closingNBV;
  acc.closingAccumulated += s.closingAccumulated;
  for (let i = 0; i < 12; i++) acc.months[i] += s.months[i];
}

function buildRows(groups: [string, YearSchedule[]][]): Row[] {
  const rows: Row[] = [];
  const gtot = zeros();
  for (const [category, schedules] of groups) {
    const subtotal = zeros();
    for (const s of schedules) {
      rows.push({
        category,
        inv: s.asset.asset_number ?? "",
        description: s.asset.description,
        location: s.asset.location ?? "",
        purchase: s.asset.purchase_date,
        costPurchase: s.asset.purchase_price,
        openingNBV: s.openingNBV,
        additions: s.additions,
        disposals: s.disposals,
        yearDepreciation: s.yearDepreciation,
        closingNBV: s.closingNBV,
        rate: `${(s.asset.rate_per_year * 100).toFixed(1)}%`,
        monthly: s.monthlyDepreciation,
        months: s.months,
        closingAccumulated: s.closingAccumulated,
      });
      addInto(subtotal, s);
      addInto(gtot, s);
    }
    rows.push({
      category,
      isSubtotal: true,
      inv: "",
      description: `Subtotal — ${category}`,
      location: "",
      purchase: "",
      rate: "",
      monthly: 0,
      ...subtotal,
    });
  }
  rows.push({
    category: "",
    isGrand: true,
    inv: "",
    description: "GRAND TOTAL",
    location: "",
    purchase: "",
    rate: "",
    monthly: 0,
    ...gtot,
  });
  return rows;
}

const HEADERS = [
  "Category",
  "Inv #",
  "Description",
  "Location",
  "Purchased",
  "Cost purchase",
  "NBV 01.01",
  "Additions",
  "Disposals",
  "Annual Depr.",
  "NBV 31.12",
  "Rate",
  "Monthly",
  ...MONTH_LABELS,
  "Acc. Depr. 31.12",
];

const fmt = (n: number) => (n ? Number(n.toFixed(2)) : 0);

export function exportToExcel(
  groups: [string, YearSchedule[]][],
  year: number,
) {
  const rows = buildRows(groups);
  const aoa: (string | number)[][] = [HEADERS];
  for (const r of rows) {
    aoa.push([
      r.isSubtotal || r.isGrand ? "" : r.category,
      r.inv,
      r.description,
      r.location,
      r.purchase,
      fmt(r.costPurchase),
      fmt(r.openingNBV),
      fmt(r.additions),
      fmt(r.disposals),
      fmt(r.yearDepreciation),
      fmt(r.closingNBV),
      r.rate,
      fmt(r.monthly),
      ...r.months.map(fmt),
      fmt(r.closingAccumulated),
    ]);
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Schedule ${year}`);
  XLSX.writeFile(wb, `depreciation-schedule-${year}.xlsx`);
}

export function exportToPDF(
  groups: [string, YearSchedule[]][],
  year: number,
) {
  const rows = buildRows(groups);
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a3" });
  doc.setFontSize(14);
  doc.text(`Depreciation Schedule — ${year}`, 40, 30);
  const body = rows.map((r) => [
    r.isSubtotal || r.isGrand ? "" : r.category,
    r.inv,
    r.description,
    r.location,
    r.purchase,
    fmtCell(r.costPurchase),
    fmtCell(r.openingNBV),
    fmtCell(r.additions),
    fmtCell(r.disposals),
    fmtCell(r.yearDepreciation),
    fmtCell(r.closingNBV),
    r.rate,
    fmtCell(r.monthly),
    ...r.months.map(fmtCell),
    fmtCell(r.closingAccumulated),
  ]);
  autoTable(doc, {
    head: [HEADERS],
    body,
    startY: 45,
    styles: { fontSize: 6, cellPadding: 2 },
    headStyles: { fillColor: [60, 60, 60] },
    didParseCell: (data) => {
      const row = rows[data.row.index];
      if (!row) return;
      if (row.isGrand) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [220, 230, 245];
      } else if (row.isSubtotal) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
  });
  doc.save(`depreciation-schedule-${year}.pdf`);
}

function fmtCell(n: number): string {
  if (!n) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
