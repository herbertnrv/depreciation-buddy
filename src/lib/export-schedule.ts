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

export type SummaryPDFOptions = {
  companyName?: string;
  place?: string;
  date?: string;
  preparedBy?: string;
  approvedBy?: string;
};

export function exportSummaryPDF(
  groups: [string, YearSchedule[]][],
  year: number,
  options: SummaryPDFOptions = {},
) {
  const companyName = options.companyName ?? "GastronoAssets — Hotel & Gastro Service";
  const place = options.place ?? "";
  const dateStr = options.date ?? "";
  const preparedBy = options.preparedBy ?? "";
  const approvedBy = options.approvedBy ?? "";
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Header: company name top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(companyName, pageW - 40, 40, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `As at 31.12.${year}`,
    pageW - 40,
    55,
    { align: "right" },
  );

  // Title left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Fixed Asset Register — Summary", 40, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Financial year ${year}`, 40, 62);

  // Build category totals
  type Tot = {
    category: string;
    cost: number;
    nbvOpen: number;
    add: number;
    disp: number;
    depr: number;
    nbvClose: number;
  };
  const rows: Tot[] = [];
  const g: Tot = {
    category: "Total",
    cost: 0, nbvOpen: 0, add: 0, disp: 0, depr: 0, nbvClose: 0,
  };
  for (const [category, schedules] of groups) {
    const t: Tot = { category, cost: 0, nbvOpen: 0, add: 0, disp: 0, depr: 0, nbvClose: 0 };
    for (const s of schedules) {
      t.cost += s.asset.purchase_price;
      t.nbvOpen += s.openingNBV;
      t.add += s.additions;
      t.disp += s.disposals;
      t.depr += s.yearDepreciation;
      t.nbvClose += s.closingNBV;
    }
    rows.push(t);
    g.cost += t.cost;
    g.nbvOpen += t.nbvOpen;
    g.add += t.add;
    g.disp += t.disp;
    g.depr += t.depr;
    g.nbvClose += t.nbvClose;
  }

  const HEAD = [[
    "Category",
    "Cost (purchase)",
    "NBV 01.01.",
    "Additions",
    "Disposals",
    "Depreciation",
    "NBV 31.12.",
  ]];
  const body = rows.map((r) => [
    r.category,
    fmtCell(r.cost),
    fmtCell(r.nbvOpen),
    fmtCell(r.add),
    fmtCell(r.disp),
    fmtCell(r.depr),
    fmtCell(r.nbvClose),
  ]);
  body.push([
    "TOTAL",
    fmtCell(g.cost),
    fmtCell(g.nbvOpen),
    fmtCell(g.add),
    fmtCell(g.disp),
    fmtCell(g.depr),
    fmtCell(g.nbvClose),
  ]);

  autoTable(doc, {
    head: HEAD,
    body,
    startY: 85,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 10, cellPadding: 6, halign: "right" },
    headStyles: { fillColor: [60, 60, 60], halign: "center", fontStyle: "bold" },
    columnStyles: { 0: { halign: "left", fontStyle: "bold" } },
    didParseCell: (data) => {
      if (data.row.index === body.length - 1) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [220, 230, 245];
      }
    },
  });

  // Highlighted total depreciation box
  // @ts-expect-error jspdf-autotable attaches lastAutoTable
  const finalY: number = doc.lastAutoTable?.finalY ?? 200;
  const boxY = finalY + 18;
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(180);
  doc.roundedRect(40, boxY, pageW - 80, 36, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Total depreciation ${year}:`, 56, boxY + 23);
  doc.setFontSize(13);
  doc.text(fmtCell(g.depr), pageW - 56, boxY + 23, { align: "right" });

  // Signature block at bottom
  const sigY = pageH - 90;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Place, Date: ____________________________", 40, sigY);

  const colW = (pageW - 80) / 2;
  const line1X = 40;
  const line2X = 40 + colW;
  const lineY = sigY + 50;
  doc.line(line1X, lineY, line1X + colW - 30, lineY);
  doc.line(line2X, lineY, line2X + colW - 30, lineY);
  doc.setFontSize(9);
  // Signature block at bottom
  const sigY = pageH - 90;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const placeDateText = place || dateStr
    ? `Place, Date: ${place}${place && dateStr ? ", " : ""}${dateStr}`
    : "Place, Date: ____________________________";
  doc.text(placeDateText, 40, sigY);

  const colW = (pageW - 80) / 2;
  const line1X = 40;
  const line2X = 40 + colW;
  const lineY = sigY + 50;
  doc.line(line1X, lineY, line1X + colW - 30, lineY);
  doc.line(line2X, lineY, line2X + colW - 30, lineY);
  if (preparedBy) {
    doc.setFontSize(10);
    doc.text(preparedBy, line1X, lineY - 4);
  }
  if (approvedBy) {
    doc.setFontSize(10);
    doc.text(approvedBy, line2X, lineY - 4);
  }
  doc.setFontSize(9);
  doc.text("Signature — prepared by", line1X, lineY + 14);
  doc.text("Signature — approved by", line2X, lineY + 14);

  doc.save(`fixed-asset-summary-${year}.pdf`);
}

// Compute the same totals as the PDF, for use by the preview UI.
export type SummaryTotals = {
  category: string;
  cost: number;
  nbvOpen: number;
  add: number;
  disp: number;
  depr: number;
  nbvClose: number;
};

export function computeSummaryTotals(
  groups: [string, YearSchedule[]][],
): { rows: SummaryTotals[]; total: SummaryTotals } {
  const rows: SummaryTotals[] = [];
  const total: SummaryTotals = {
    category: "TOTAL",
    cost: 0, nbvOpen: 0, add: 0, disp: 0, depr: 0, nbvClose: 0,
  };
  for (const [category, schedules] of groups) {
    const t: SummaryTotals = { category, cost: 0, nbvOpen: 0, add: 0, disp: 0, depr: 0, nbvClose: 0 };
    for (const s of schedules) {
      t.cost += s.asset.purchase_price;
      t.nbvOpen += s.openingNBV;
      t.add += s.additions;
      t.disp += s.disposals;
      t.depr += s.yearDepreciation;
      t.nbvClose += s.closingNBV;
    }
    rows.push(t);
    total.cost += t.cost;
    total.nbvOpen += t.nbvOpen;
    total.add += t.add;
    total.disp += t.disp;
    total.depr += t.depr;
    total.nbvClose += t.nbvClose;
  }
  return { rows, total };
}
