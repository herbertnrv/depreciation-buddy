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
  openingCost: number;
  additions: number;
  disposals: number;
  closingCost: number;
  monthly: number;
  rate: string;
  months: number[];
  yearDepreciation: number;
  closingAccumulated: number;
  openingNBV: number;
  closingNBV: number;
};

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
        openingCost: s.openingCost,
        additions: s.additions,
        disposals: s.disposals,
        closingCost: s.closingCost,
        monthly: s.monthlyDepreciation,
        rate: `${(s.asset.rate_per_year * 100).toFixed(1)}%`,
        months: s.months,
        yearDepreciation: s.yearDepreciation,
        closingAccumulated: s.closingAccumulated,
        openingNBV: s.openingNBV,
        closingNBV: s.closingNBV,
      });
      addInto(subtotal, s);
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
    for (let i = 0; i < 12; i++) gtot.months[i] += subtotal.months[i];
    gtot.openingCost += subtotal.openingCost;
    gtot.additions += subtotal.additions;
    gtot.disposals += subtotal.disposals;
    gtot.closingCost += subtotal.closingCost;
    gtot.yearDepreciation += subtotal.yearDepreciation;
    gtot.closingAccumulated += subtotal.closingAccumulated;
    gtot.openingNBV += subtotal.openingNBV;
    gtot.closingNBV += subtotal.closingNBV;
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

function zeros() {
  return {
    months: Array(12).fill(0) as number[],
    openingCost: 0,
    additions: 0,
    disposals: 0,
    closingCost: 0,
    yearDepreciation: 0,
    closingAccumulated: 0,
    openingNBV: 0,
    closingNBV: 0,
  };
}

function addInto(acc: ReturnType<typeof zeros>, s: YearSchedule) {
  for (let i = 0; i < 12; i++) acc.months[i] += s.months[i];
  acc.openingCost += s.openingCost;
  acc.additions += s.additions;
  acc.disposals += s.disposals;
  acc.closingCost += s.closingCost;
  acc.yearDepreciation += s.yearDepreciation;
  acc.closingAccumulated += s.closingAccumulated;
  acc.openingNBV += s.openingNBV;
  acc.closingNBV += s.closingNBV;
}

const HEADERS = [
  "Category",
  "Inv #",
  "Description",
  "Location",
  "Purchased",
  "Cost 01.01",
  "Additions",
  "Disposals",
  "Cost 31.12",
  "Rate",
  "Monthly",
  ...MONTH_LABELS,
  "Year Depr.",
  "Acc. Depr. 31.12",
  "NBV 01.01",
  "NBV 31.12",
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
      fmt(r.openingCost),
      fmt(r.additions),
      fmt(r.disposals),
      fmt(r.closingCost),
      r.rate,
      fmt(r.monthly),
      ...r.months.map(fmt),
      fmt(r.yearDepreciation),
      fmt(r.closingAccumulated),
      fmt(r.openingNBV),
      fmt(r.closingNBV),
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
    fmtCell(r.openingCost),
    fmtCell(r.additions),
    fmtCell(r.disposals),
    fmtCell(r.closingCost),
    r.rate,
    fmtCell(r.monthly),
    ...r.months.map(fmtCell),
    fmtCell(r.yearDepreciation),
    fmtCell(r.closingAccumulated),
    fmtCell(r.openingNBV),
    fmtCell(r.closingNBV),
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
