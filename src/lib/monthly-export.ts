import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type MonthlyVoucher } from './monthly-voucher';
import { money,dateLabel } from './asset-model';
import { translate } from './i18n';
import { numberFormat,downloadText } from './report-export';
export const categoryHeaders=['Category','Number of assets','Depreciation of the month','Depreciation year-to-date','Accumulated depreciation at month-end','NBV at month-end'];
export const detailHeaders=['Asset number','Description','Category','Location','Total cost','Depreciation of the month'];
export const journalHeaders=['Voucher no.','Posting date','Account','Account name','Debit','Credit','Text','Cost centre'];
export function periodLabel(v:MonthlyVoucher){return new Intl.DateTimeFormat(v.settings.language==='DE'?'de-DE':'en-GB',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${v.start}T00:00:00Z`));}
export function voucherNote(v:MonthlyVoucher){return v.settings.language==='DE'?`Betrag entspricht Spalte ${periodLabel(v).split(' ')[0]} des Anlagenspiegels ${v.year}.`:`Amount equals column ${periodLabel(v).split(' ')[0]} of the Depreciation Schedule ${v.year}.`;}
export function voucherWorkbook(v:MonthlyVoucher,detail:boolean){
 const t=(s:string)=>translate(s,v.settings.language),wb=XLSX.utils.book_new(),fmt=numberFormat(v.settings);
 const data:(string|number)[][]=[[v.settings.companyName],[t('Depreciation Voucher')],[`${periodLabel(v)} | ${dateLabel(v.start)} – ${dateLabel(v.end)}`],[`${v.number} | ${v.settings.reportingCurrency} | ${t('Printed')} ${dateLabel(new Date().toISOString())}`],[`${t('Cost centre')}: ${v.costCentre||t('All cost centres')}`],[],categoryHeaders.map(t)];
 const first=8;for(const r of v.categories)data.push([r.category,r.count,r.depreciation,r.ytd,r.accumulated,r.nbv]);
 const total=data.length+1;data.push([t('TOTAL'),...Array(5).fill(0)]);
 const formulas:{r:number;c:number;f:string;v:number}[]=[];
 const totals=[v.assets.length,v.total,...(['ytd','accumulated','nbv'] as const).map(k=>v.categories.reduce((s,r)=>s+r[k],0))];
 for(let c=1;c<=5;c++)formulas.push({r:total-1,c,f:v.categories.length?`SUM(${XLSX.utils.encode_col(c)}${first}:${XLSX.utils.encode_col(c)}${total-1})`:'0',v:totals[c-1]});
 data.push([],[t('Posting proposal')],[t('Debit account'),t('Credit account'),t('Amount'),t('Text')]);
 const journalStart=data.length+1;
 for(let i=0;i<v.journal.length;i+=2){const debit=v.journal[i],credit=v.journal[i+1];data.push([`${debit.account||t('Missing')} ${debit.accountName}`,`${credit?.account||t('Missing')} ${credit?.accountName||''}`,debit.debit,debit.text]);}
 const postTotal=data.length+1;data.push([t('TOTAL'),'',v.total]);formulas.push({r:postTotal-1,c:2,f:v.journal.length?`SUM(C${journalStart}:C${postTotal-1})`:'0',v:v.total});
 data.push([t('Total debit = total credit'),0]);formulas.push({r:data.length-1,c:1,f:`SUM(Journal!E2:E${Math.max(2,v.journal.length+1)})-SUM(Journal!F2:F${Math.max(2,v.journal.length+1)})`,v:0});
 if(v.warnings.length)data.push([`${t('Missing accounting accounts')}: ${v.warnings.join(', ')}`]);
 if(detail){data.push([],[t('Asset detail')],detailHeaders.map(t));for(const a of v.assets)data.push([a.number,a.description,a.category,a.location,a.cost,a.depreciation]);}
 if(v.changes.length){data.push([],[t('Assets with changes')],['Asset number','Description','Category','Event','Amount'].map(t));for(const c of v.changes)data.push([c.number,c.description,c.category,t(c.event),c.amount]);}
 data.push([],[`${t('Prepared by')} ____  ${t('Reviewed by')} ____  ${t('Approved by')} ____`],[`${t('Place, Date')}: ____`],[voucherNote(v)]);
 const ws=XLSX.utils.aoa_to_sheet(data);for(const f of formulas)ws[XLSX.utils.encode_cell(f)]={t:'n',v:f.v,f:f.f};
 for(const cell of Object.values(ws))if(typeof cell==='object'&&cell?.t==='n')cell.z=fmt;
 ws['!cols']=[{wch:32},{wch:36},{wch:26},{wch:38},{wch:26},{wch:24}];
 XLSX.utils.book_append_sheet(wb,ws,'Voucher');
 const journal=XLSX.utils.aoa_to_sheet([journalHeaders.map(t),...v.journal.map(r=>[r.voucher,dateLabel(r.date),r.account,r.accountName,r.debit,r.credit,r.text,r.costCentre])]);
 for(let r=1;r<=v.journal.length;r++)for(const c of [4,5]){const cell=journal[XLSX.utils.encode_cell({r,c})];if(cell)cell.z=fmt;}
 journal['!cols']=[{wch:18},{wch:16},{wch:18},{wch:32},{wch:22},{wch:22},{wch:50},{wch:22}];XLSX.utils.book_append_sheet(wb,journal,'Journal');return wb;
}
export function exportVoucherExcel(v:MonthlyVoucher,detail:boolean){XLSX.writeFile(voucherWorkbook(v,detail),`${v.number}${v.costCentre?'-filtered':''}.xlsx`);}
export function exportVoucherCSV(v:MonthlyVoucher){const ws=voucherWorkbook(v,false).Sheets.Journal;downloadText('\ufeff'+XLSX.utils.sheet_to_csv(ws),`${v.number}-journal.csv`,'text/csv;charset=utf-8');}
export function yearWorkbook(vouchers:MonthlyVoucher[],detail:boolean){
 const wb=XLSX.utils.book_new(),first=vouchers[0];if(!first)return wb;const t=(s:string)=>translate(s,first.settings.language),cats=[...new Set(vouchers.flatMap(v=>v.categories.map(c=>c.category)))].sort();
 const data:(string|number)[][]=[[first.settings.companyName],[`${t('Financial year')} ${first.year} | ${first.settings.reportingCurrency}`],[],[t('Category'),...vouchers.map(periodLabel),t('TOTAL')]];
 for(const cat of cats)data.push([cat,...vouchers.map(v=>v.categories.find(c=>c.category===cat)?.depreciation||0),0]);
 data.push([t('TOTAL'),...Array(vouchers.length+1).fill(0)]);const ws=XLSX.utils.aoa_to_sheet(data);
 for(let r=4;r<data.length;r++)for(let c=1;c<=vouchers.length+1;c++){
  const address=XLSX.utils.encode_cell({r,c});const value=Number(data[r][c]);let f='';
  if(c===vouchers.length+1)f=`SUM(B${r+1}:${XLSX.utils.encode_col(c-1)}${r+1})`;
  else if(r===data.length-1)f=cats.length?`SUM(${XLSX.utils.encode_col(c)}5:${XLSX.utils.encode_col(c)}${r})`:'0';
  ws[address]={t:'n',v:c===vouchers.length+1?(r===data.length-1?vouchers.reduce((s,v)=>s+v.total,0):vouchers.reduce((s,v)=>s+(v.categories.find(cat=>cat.category===data[r][0])?.depreciation||0),0)):(r===data.length-1?vouchers[c-1].total:value),...(f?{f}:{}),z:numberFormat(first.settings)};
 }
 ws['!cols']=[{wch:30},...vouchers.map(()=>({wch:22})),{wch:24}];XLSX.utils.book_append_sheet(wb,ws,'Year summary');
 for(const v of vouchers){const partial=voucherWorkbook(v,detail),sheet=partial.Sheets.Voucher;for(const cell of Object.values(sheet))if(typeof cell==='object'&&cell?.f)cell.f=cell.f.replaceAll('Journal!',`'Journal ${String(v.month).padStart(2,'0')}'!`);XLSX.utils.book_append_sheet(wb,sheet,`Month ${String(v.month).padStart(2,'0')}`);XLSX.utils.book_append_sheet(wb,partial.Sheets.Journal,`Journal ${String(v.month).padStart(2,'0')}`);}
 return wb;
}
export function exportVoucherYear(v:MonthlyVoucher[],detail:boolean){XLSX.writeFile(yearWorkbook(v,detail),`depreciation-vouchers-${v[0]?.year}.xlsx`);}
export function voucherPDF(v:MonthlyVoucher,detail:boolean){
 const t=(s:string)=>translate(s,v.settings.language),doc=new jsPDF({unit:'pt',format:'a4',orientation:'portrait'}),W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();let y=105;
 const n=(x:number)=>money(x,v.settings.reportingCurrency);
 const table=(head:string[],body:(string|number)[][],numeric:number[]=[],total=false)=>{
  if(y>H-180){doc.addPage();y=105;}
  autoTable(doc,{head:[head.map(t)],body:body.map(r=>r.map((x,i)=>typeof x==='number'?(numeric.includes(i)?n(x):String(x)):x)),startY:y,margin:{top:105,bottom:90,left:28,right:28},rowPageBreak:'avoid',showHead:'everyPage',styles:{fontSize:7.5,cellPadding:4,overflow:'linebreak'},headStyles:{fillColor:[45,55,50]},columnStyles:Object.fromEntries(numeric.map(i=>[i,{halign:'right'}])),didParseCell:d=>{if(d.section==='body'&&total&&d.row.index===body.length-1){d.cell.styles.fontStyle='bold';d.cell.styles.fillColor=[225,237,230];}if(d.section==='body'&&String(d.cell.raw).startsWith('('))d.cell.styles.textColor=[180,35,35];}});
  y=(doc as jsPDF&{lastAutoTable:{finalY:number}}).lastAutoTable.finalY+12;
 };
 table(categoryHeaders,[...v.categories.map(r=>[r.category,r.count,r.depreciation,r.ytd,r.accumulated,r.nbv]),[t('TOTAL'),v.assets.length,v.total,...(['ytd','accumulated','nbv'] as const).map(k=>v.categories.reduce((s,r)=>s+r[k],0))]],[2,3,4,5],true);
 if(detail)table(detailHeaders,v.assets.map(a=>[a.number,a.description,a.category,a.location,a.cost,a.depreciation]),[4,5]);
 const proposal=[];for(let i=0;i<v.journal.length;i+=2){const d=v.journal[i],c=v.journal[i+1];proposal.push([`${d.account||t('Missing')} ${d.accountName}`,`${c?.account||t('Missing')} ${c?.accountName||''}`,d.debit,d.text]);}proposal.push([t('TOTAL'),'',v.total,t('Total debit = total credit')]);table(['Debit account','Credit account','Amount','Text'],proposal,[2],true);
 if(v.warnings.length)table(['Missing accounting accounts'],[[v.warnings.join(', ')]]);
 if(v.changes.length)table(['Asset number','Description','Category','Event','Amount'],v.changes.map(c=>[c.number,c.description,c.category,t(c.event),c.amount]),[4]);
 const pages=doc.getNumberOfPages();for(let p=1;p<=pages;p++){doc.setPage(p);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(doc.splitTextToSize(v.settings.companyName,W-56).slice(0,2),28,26);doc.setFontSize(14);doc.text(t('Depreciation Voucher'),28,52);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(`${periodLabel(v)} | ${dateLabel(v.start)} – ${dateLabel(v.end)}`,28,68);doc.text(`${v.number} | ${v.settings.reportingCurrency} | ${t('Printed')} ${dateLabel(new Date().toISOString())}`,28,82);if(v.costCentre)doc.text(`${t('Cost centre')}: ${v.costCentre}`,28,96);doc.setFontSize(8);doc.text(`${t('Prepared by')} ____  ${t('Reviewed by')} ____  ${t('Approved by')} ____`,28,H-65);doc.text(`${t('Place, Date')}: __________________`,28,H-48);doc.text(doc.splitTextToSize(voucherNote(v),W-56),28,H-32);doc.text(`${t('Page')} ${p} ${t('of')} ${pages}`,W-28,H-15,{align:'right'});}return doc;
}
export function exportVoucherPDF(v:MonthlyVoucher,detail:boolean){voucherPDF(v,detail).save(`${v.number}.pdf`);}
export function printVoucher(v:MonthlyVoucher,detail:boolean){const doc=voucherPDF(v,detail);doc.autoPrint();const url=doc.output('bloburl');const win=window.open(url,'_blank');if(!win)throw new Error('Allow a print window to open.');}
