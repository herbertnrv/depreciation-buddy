import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type AssetInput, type YearSchedule, MONTH_LABELS } from './depreciation';
import { type Settings, money, dateLabel, precision } from './asset-model';
import { translate } from './i18n';
import { reportRows, reportColumns, type ReportRow, type ReportColumn } from './report-model';
import { db } from './local-db';
export type ReportOptions={expanded:Set<string>;detail:boolean;share:boolean;place:string;date:string;preparedBy:string;reviewedBy:string};
export const defaultReportOptions=():ReportOptions=>({expanded:new Set(),detail:false,share:false,place:'',date:new Date().toISOString().slice(0,10),preparedBy:'',reviewedBy:''});
export function downloadText(text:string,file:string,type:string){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function columnsFor(groups:[string,YearSchedule[]][],o:ReportOptions){return reportColumns(o.detail,groups.some(([,ss])=>ss.some(s=>s.costRemoved>0)),o.share,groups.some(([,ss])=>ss.some(s=>s.impairment||s.adjustment)));}
export function numberFormat(settings:Settings){return precision(settings.reportingCurrency)===0?'#,##0;[Red](#,##0);"–"':'#,##0.00;[Red](#,##0.00);"–"';}
export function summaryWorkbook(groups:[string,YearSchedule[]][],year:number,settings:Settings,o:ReportOptions) {
 const t=(s:string)=>translate(s,settings.language),wb=XLSX.utils.book_new(),cols=columnsFor(groups,o),rows=reportRows(groups,o.expanded);
 const all=groups.flatMap(([,ss])=>ss);const detailHeaders=[t('Category'),t('Asset number'),t('Description'),t('Status'),t('Disposal date'),...cols.map(c=>t(c.label)),...MONTH_LABELS.map(t)];
 const assetValues=all.map(s=>{const r=reportRows([[s.category,[s]]],new Set([s.category]))[1];return [s.category,s.asset.asset_number||'',s.asset.description,t(s.status),dateLabel(s.asset.disposal_date||''),...cols.map(c=>Number(r[c.key])||0),...s.displayMonths];});
 const detail=XLSX.utils.aoa_to_sheet([detailHeaders,...assetValues]);
 const header=[t('Category'),...cols.map(c=>t(c.label)),t('Check')];
 const aoa:(string|number)[][]=[[settings.companyName],[`${t('Summary')} | ${t('Financial year')} ${year} | ${settings.reportingCurrency}`],[`${t('As at')} 31.12.${year} | ${t('Printed')} ${dateLabel(new Date().toISOString())}`],[],header,...rows.map(r=>[r.kind==='asset'?`  ${r.label}`:t(r.label),...cols.map(c=>Number(r[c.key])||0),0])];
 const ws=XLSX.utils.aoa_to_sheet(aoa);const catCells=new Map<string,number>();const assetIndex=new Map(all.map((s,i)=>[s.asset.id,i+2]));
 for(let i=0;i<rows.length;i++){const r=rows[i],row=i+6;
  if(r.kind==='category')catCells.set(r.category,row);
  for(let j=0;j<cols.length;j++){const address=XLSX.utils.encode_cell({r:row-1,c:j+1}),sourceCol=XLSX.utils.encode_col(j+5);let formula='';
   if(r.kind==='asset')formula=`Assets!${sourceCol}${assetIndex.get(r.id)}`;
   else if(r.kind==='category') {const children=all.filter(s=>s.category===r.category);formula=children.map(s=>`Assets!${sourceCol}${assetIndex.get(s.asset.id)}`).join('+')||'0';}
   else formula=[...catCells.values()].map(n=>`${XLSX.utils.encode_col(j+1)}${n}`).join('+')||'0';
   ws[address]={t:'n',v:Number(r[cols[j].key])||0,f:formula,z:cols[j].key==='share'?'0.00':numberFormat(settings)};
  }
  const col=(key:string)=>`${XLSX.utils.encode_col(cols.findIndex(c=>c.key===key)+1)}${row}`;
  ws[XLSX.utils.encode_cell({r:row-1,c:cols.length+1})]={t:'n',v:0,f:`${col('nbvOpen')}+${col('add')}-${col('disp')}-${col('depr')}-${col('nbvClose')}`,z:numberFormat(settings)};
 }
 for(let r=1;r<=assetValues.length;r++)for(let c=5;c<detailHeaders.length;c++){const cell=detail[XLSX.utils.encode_cell({r,c})];if(cell)cell.z=numberFormat(settings);}
 ws['!cols']=[{wch:38},...cols.map(()=>({wch:20})),{wch:18}];detail['!cols']=detailHeaders.map((_,i)=>({wch:i===2?40:20}));
 // SheetJS CE does not serialize frozen panes; patch generated OOXML in exportSummary below.
 XLSX.utils.book_append_sheet(wb,ws,'Summary');XLSX.utils.book_append_sheet(wb,detail,'Assets');return wb;
}
export async function exportSummary(groups:[string,YearSchedule[]][],year:number,settings:Settings,o:ReportOptions) {
 const wb=summaryWorkbook(groups,year,settings,o);const bytes=XLSX.write(wb,{type:'array',bookType:'xlsx'});
 const {default:JSZip}=await import('jszip');const zip=await JSZip.loadAsync(bytes);
 for(const [name,y] of [['xl/worksheets/sheet1.xml',5],['xl/worksheets/sheet2.xml',1]] as const){const file=zip.file(name);if(file){let xml=await file.async('string');const views=`<sheetViews><sheetView workbookViewId="0"><pane ySplit="${y}" topLeftCell="A${y+1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`;xml=xml.includes('<sheetViews')?xml.replace(/<sheetViews[\s\S]*?<\/sheetViews>/,views):xml.replace('<sheetFormatPr',views+'<sheetFormatPr');if(!xml.includes('<sheetViews'))xml=xml.replace('<sheetData>',views+'<sheetData>');zip.file(name,xml);}}
 const blob=await zip.generateAsync({type:'blob'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`fixed-asset-summary-${year}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function summaryPDF(groups:[string,YearSchedule[]][],year:number,settings:Settings,o:ReportOptions){
 const t=(s:string)=>translate(s,settings.language),doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'}),rows=reportRows(groups,o.expanded),cols=columnsFor(groups,o);
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
 const body=rows.map(r=>[r.kind==='asset'?`  ${r.label}${r.status==='Disposed'?` (${t('Disposed')}, ${dateLabel(r.date||'')})`:''}`:t(r.label),...cols.map(c=>c.key==='share'?`${Number(r[c.key]).toFixed(1)}%`:money(Number(r[c.key]),settings.reportingCurrency))]);
 autoTable(doc,{head:[[t('Category'),...cols.map(c=>t(c.label))]],body,startY:85,margin:{left:28,right:28,top:85,bottom:100},rowPageBreak:'avoid',showHead:'everyPage',styles:{fontSize:cols.length>8?7:9,cellPadding:5,halign:'right'},columnStyles:{0:{halign:'left',cellWidth:cols.length>8?150:200}},headStyles:{fillColor:[45,55,50],textColor:[255,255,255]},alternateRowStyles:{fillColor:[245,247,246]},didParseCell:data=>{const row=rows[data.row.index];if(data.section!=='body'||!row)return;if(row.kind!=='asset'){data.cell.styles.fontStyle='bold';if(row.kind==='total')data.cell.styles.fillColor=[225,237,230];}if(data.column.index>0&&body[data.row.index]?.[data.column.index]?.startsWith('('))data.cell.styles.textColor=[180,35,35];},willDrawCell:data=>{if(data.section==='body'&&rows[data.row.index]?.kind==='total'&&data.column.index===0&&data.cursor&&data.cursor.y>H-130)doc.addPage();},didDrawPage:()=>{
 doc.setFontSize(14);doc.setFont('helvetica','bold');doc.text(t('Summary'),28,32);doc.setFontSize(10);doc.text(settings.companyName,W-28,32,{align:'right'});doc.setFont('helvetica','normal');doc.text(`${t('Financial year')} ${year} | ${settings.reportingCurrency}`,28,50);doc.text(`${t('As at')} 31.12.${year}`,W-28,50,{align:'right'});doc.setFontSize(8);doc.text(`${t('Printed')} ${dateLabel(new Date().toISOString())}`,28,65);
 }});
 const pages=doc.getNumberOfPages();for(let p=1;p<=pages;p++){doc.setPage(p);doc.setFontSize(9);doc.text(`${t('Place, Date')}: ${o.place||'________________'}, ${dateLabel(o.date)}`,28,H-72);doc.line(28,H-36,W/2-30,H-36);doc.line(W/2+15,H-36,W-28,H-36);doc.text(o.preparedBy,28,H-40);doc.text(o.reviewedBy,W/2+15,H-40);doc.text(t('Prepared by'),28,H-23);doc.text(t('Reviewed by'),W/2+15,H-23);doc.text(`${t('Page')} ${p} ${t('of')} ${pages}`,W-28,H-10,{align:'right'});}return doc;
}
export function exportSummaryPDFv2(groups:[string,YearSchedule[]][],year:number,settings:Settings,o:ReportOptions){summaryPDF(groups,year,settings,o).save(`fixed-asset-summary-${year}.pdf`);}
export function printSummaryPDF(groups:[string,YearSchedule[]][],year:number,settings:Settings,o:ReportOptions){const doc=summaryPDF(groups,year,settings,o);doc.autoPrint();const url=doc.output('bloburl');window.open(url,'_blank');}
export async function exportAllExcel(assets:AssetInput[],settings:Settings){const wb=XLSX.utils.book_new();const rows=assets.map(a=>({...a,attachments:JSON.stringify(a.attachments),disposals_history:JSON.stringify(a.disposals_history),impairments:JSON.stringify(a.impairments),transfers:JSON.stringify(a.transfers)}));XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),'Assets');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet([settings]),'Settings');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(await db().audit.toArray()),'Audit');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(await db().counts.toArray()),'Inventory');XLSX.writeFile(wb,'gastronoassets-all-data.xlsx');}
export function exportScheduleV2(groups:[string,YearSchedule[]][],year:number,settings:Settings,format:'excel'|'pdf') {
 const t=(s:string)=>translate(s,settings.language),head=[t('Category'),t('Asset number'),t('Description'),t('Purchased'),t('Status'),t('Cost 31.12.'),t('NBV 01.01.'),t('Additions'),t('Disposals'),t('Depreciation'),t('NBV 31.12.'),...MONTH_LABELS.map(t),t('Accumulated depreciation 31.12.')];
 const rows=groups.flatMap(([cat,ss])=>{const values=(s:YearSchedule)=>([cat,s.asset.asset_number||'',s.asset.description,dateLabel(s.asset.purchase_date),t(s.status),s.closingCost,s.openingNBV,s.additions+s.adjustment,s.disposals,s.yearDepreciation+s.impairment,s.closingNBV,...s.displayMonths,s.closingAccumulated]);return ss.map(values);});
 if(format==='excel'){const wb=XLSX.utils.book_new(),ws=XLSX.utils.aoa_to_sheet([head,...rows]);for(let r=1;r<=rows.length;r++)for(let c=5;c<head.length;c++){const cell=ws[XLSX.utils.encode_cell({r,c})];if(cell)cell.z=numberFormat(settings);}XLSX.utils.book_append_sheet(wb,ws,`Schedule ${year}`);XLSX.writeFile(wb,`depreciation-schedule-${year}.xlsx`);}else{const doc=new jsPDF({orientation:'landscape',format:'a3'});doc.text(`${t('Depreciation Schedule')} ${year} | ${settings.reportingCurrency}`,14,12);autoTable(doc,{head:[head],body:rows.map(r=>r.map(v=>typeof v==='number'?money(v,settings.reportingCurrency):v)),startY:20,styles:{fontSize:6,cellPadding:1.5},rowPageBreak:'avoid'});doc.save(`depreciation-schedule-${year}.pdf`);}
}
