import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type AssetInput, totalCost } from './depreciation';
import { type Settings, dateLabel, money } from './asset-model';
import { translate } from './i18n';
import { additionsForYear, annualAdditions } from './additions';
import { numberFormat } from './report-export';

const headers = ['Category', 'Asset number', 'Description', 'Purchase date', 'Location', 'Cost centre', 'Total cost'];
function values(a: AssetInput): (string | number)[] {
  return [a.category, a.asset_number || '–', a.description, dateLabel(a.purchase_date), a.location || '–', a.cost_centre || '–', totalCost(a)];
}
export function additionsWorkbook(assets: AssetInput[], year: number, settings: Settings) {
  const t = (s: string) => translate(s, settings.language), wb = XLSX.utils.book_new();
  const rows = additionsForYear(assets, year);
  const ws = XLSX.utils.aoa_to_sheet([[settings.companyName], [`${t('Annual additions')} ${year} | ${settings.reportingCurrency}`], [], headers.map(t), ...rows.map(values), [t('TOTAL'), '', '', '', '', '', rows.reduce((sum, a) => sum + totalCost(a), 0)]]);
  const end = rows.length + 5;
  ws[`G${end}`] = { t: 'n', v: rows.reduce((sum, a) => sum + totalCost(a), 0), f: rows.length ? `SUM(G5:G${end - 1})` : '0', z: numberFormat(settings) };
  for (let row = 5; row < end; row++) ws[`G${row}`].z = numberFormat(settings);
  ws['!cols'] = [22, 18, 45, 18, 22, 22, 23].map(wch => ({ wch }));
  const overview = XLSX.utils.aoa_to_sheet([[t('Financial year'), t('Number of assets'), `${t('Total cost')} (${settings.reportingCurrency})`], ...annualAdditions(assets).map(r => [r.year, r.count, r.total])]);
  for (let row = 2; row <= annualAdditions(assets).length + 1; row++) overview[`C${row}`].z = numberFormat(settings);
  overview['!cols'] = [20, 22, 28].map(wch => ({ wch }));
  XLSX.utils.book_append_sheet(wb, ws, 'Additions');
  XLSX.utils.book_append_sheet(wb, overview, 'Years');
  return wb;
}
export function exportAdditionsExcel(assets: AssetInput[], year: number, settings: Settings) {
  XLSX.writeFile(additionsWorkbook(assets, year, settings), `asset-additions-${year}.xlsx`);
}
export function additionsPDF(assets: AssetInput[], year: number, settings: Settings) {
  const t = (s: string) => translate(s, settings.language), rows = additionsForYear(assets, year);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  autoTable(doc, {
    head: [headers.map(t)],
    body: [...rows.map(a => values(a).map(v => typeof v === 'number' ? money(v, settings.reportingCurrency) : v)), [t('TOTAL'), '', '', '', '', '', money(rows.reduce((sum, a) => sum + totalCost(a), 0), settings.reportingCurrency)]],
    startY: 78, margin: { top: 78, bottom: 36 }, rowPageBreak: 'avoid', showHead: 'everyPage', styles: { fontSize: 9, cellPadding: 5 }, columnStyles: { 6: { halign: 'right' } },
    didParseCell: data => { if (data.section === 'body' && data.row.index === rows.length) data.cell.styles.fontStyle = 'bold'; },
    didDrawPage: () => {
      doc.setFontSize(14); doc.text(`${t('Annual additions')} ${year}`, 40, 30);
      doc.setFontSize(9); doc.text(settings.companyName, doc.internal.pageSize.getWidth() - 40, 30, { align: 'right' });
      doc.text(`${t('Reporting currency')}: ${settings.reportingCurrency} | ${t('Number of assets')}: ${rows.length}`, 40, 50);
      doc.text(`${t('Purchase date')}: 01.01.${year} – 31.12.${year}`, 40, 65);
    },
  });
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) { doc.setPage(p); doc.text(`${t('Page')} ${p} ${t('of')} ${pages}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 16, { align: 'right' }); }
  return doc;
}