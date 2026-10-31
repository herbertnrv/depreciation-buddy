import { type YearSchedule, totalCost } from './depreciation';
import { DEFAULT_SETTINGS, type Settings, roundMoney } from './asset-model';
export type VoucherAsset = { id:string; number:string; description:string; category:string; costCentre:string; location:string; cost:number; depreciation:number; ytd:number; accumulated:number; nbv:number };
export type VoucherChange = { number:string; description:string; category:string; costCentre:string; event:'Addition'|'Disposal depreciation'|'NBV removed'|'Gain / (Loss) on disposal'|'Fully depreciated'; amount:number };
export type VoucherCategory = { category:string; count:number; depreciation:number; ytd:number; accumulated:number; nbv:number };
export type VoucherJournal = { voucher:string; date:string; account:string; accountName:string; debit:number; credit:number; text:string; costCentre:string };
export type MonthlyVoucher = { year:number; month:number; number:string; start:string; end:string; settings:Settings; assets:VoucherAsset[]; changes:VoucherChange[]; categories:VoucherCategory[]; journal:VoucherJournal[]; warnings:string[]; total:number; costCentre:string };
export type PostedMonth = { id:string; year:number; month:number; postedAt:string; initials:string; amount:number; voucher:MonthlyVoucher };
export function period(year:number,month:number) { const prefix=`${year}-${String(month).padStart(2,'0')}`;return {number:`AFA-${prefix}`,start:`${prefix}-01`,end:`${prefix}-${new Date(Date.UTC(year,month,0)).getUTCDate()}`}; }
export function previousMonth(date=new Date()) { const d=new Date(date.getFullYear(),date.getMonth()-1,1);return {year:d.getFullYear(),month:d.getMonth()+1}; }
export function centreForMonth(s:YearSchedule,year:number,month:number) { const end=period(year,month).end;return [...(s.asset.transfers||[])].filter(t=>t.date<=end).sort((a,b)=>a.date.localeCompare(b.date)).at(-1)?.cost_centre||s.asset.cost_centre||'Hotel'; }
const sum=(a:number[])=>a.reduce((s,v)=>s+v,0);
export function createVoucher(schedules:YearSchedule[],year:number,month:number,settings:Settings=DEFAULT_SETTINGS):MonthlyVoucher {
 const p=period(year,month),assets:VoucherAsset[]=[],changes:VoucherChange[]=[];
 for(const s of schedules){
  const category=s.depreciationCategories?.[month-1]||s.category,costCentre=centreForMonth(s,year,month),a=s.asset;
  const disposals=(s.disposalMovements||[]).filter(e=>e.date<=p.end),impairments=(s.impairmentMovements||[]).filter(e=>e.date<=p.end);
  const rawDep=sum(s.months.slice(0,month));
  const acquired=a.purchase_date<=p.end;
  let cost=s.openingCost+(acquired?s.additions:0)+(s.costAdjustment||0)-sum(disposals.map(e=>e.cost));
  let accumulated=s.openingAccumulated+(s.accumulatedAdjustment||0)+rawDep+sum(impairments.map(e=>e.amount))-sum(disposals.map(e=>e.accumulated));
  let nbv=cost-accumulated;
  if(month===12){cost=s.closingCost;accumulated=s.closingAccumulated;nbv=s.closingNBV;}
  const depreciation=s.displayMonths[month-1]||0;
  const item={id:a.id,number:a.asset_number||'',description:a.description,category,costCentre,location:a.location||'',cost,depreciation,ytd:sum(s.displayMonths.slice(0,month)),accumulated,nbv};
  // Retain activity even when an asset has no balance (e.g. its disposal month).
  if(acquired&&(cost>1e-7||depreciation!==0||(s.disposalMovements||[]).some(e=>e.date>=p.start&&e.date<=p.end)))assets.push(item);
  const change=(event:VoucherChange['event'],amount:number)=>changes.push({number:item.number,description:item.description,category,costCentre,event,amount});
  const service=a.in_service_date||a.purchase_date;
  let first=service.slice(0,7);if(settings.convention==='next-month'){const d=new Date(`${service}T00:00:00Z`);d.setUTCMonth(d.getUTCMonth()+1,1);first=d.toISOString().slice(0,7);}
  if(first===p.start.slice(0,7)&&a.method!=='none'&&!a.under_construction)change('Addition',totalCost(a));
  for(const e of (s.disposalMovements||[]).filter(e=>e.date>=p.start&&e.date<=p.end)){change('Disposal depreciation',depreciation);change('NBV removed',e.nbv);change('Gain / (Loss) on disposal',e.gainLoss);}
  const residual=(a.residual_value||0)*(a.exchange_rate??1)*(totalCost(a)>0?cost/totalCost(a):0);
  if(depreciation>0&&nbv<=residual+1e-6&&cost>0)change('Fully depreciated',nbv);
 }
 return assemble({year,month,...p,settings:structuredClone(settings),assets,changes,costCentre:''});
}
type VoucherBasis=Omit<MonthlyVoucher,'categories'|'journal'|'warnings'|'total'>;
function assemble(base:VoucherBasis):MonthlyVoucher {
 const grouped=new Map<string,VoucherCategory>();const warnings=new Set<string>();const posting=new Map<string,{category:string;centre:string;amount:number}>();
 for(const a of base.assets){const row=grouped.get(a.category)||{category:a.category,count:0,depreciation:0,ytd:0,accumulated:0,nbv:0};row.count++;row.depreciation+=a.depreciation;row.ytd+=a.ytd;row.accumulated+=a.accumulated;row.nbv+=a.nbv;grouped.set(a.category,row);const key=JSON.stringify([a.category,a.costCentre]);const j=posting.get(key)||{category:a.category,centre:a.costCentre,amount:0};j.amount+=a.depreciation;posting.set(key,j);}
 const journal:VoucherJournal[]=[];
 for(const r of posting.values()){if(!r.amount)continue;const account=base.settings.accounts[r.category];const override=base.settings.costCentreAccounts?.[r.centre];const expense=override?.expense||account?.expense||'',expenseName=override?.expenseName||account?.expenseName||'';
  if(!expense||!account?.accumulated)warnings.add(r.category);
  const text=`${base.settings.language==='DE'?'Abschreibung':'Depreciation'} ${r.category} ${String(base.month).padStart(2,'0')}/${base.year}`;
  const common={voucher:base.number,date:base.end,text,costCentre:r.centre};
  journal.push({...common,account:expense,accountName:expenseName,debit:r.amount,credit:0},{...common,account:account?.accumulated||'',accountName:account?.accumulatedName||'',debit:0,credit:r.amount});
 }
 return {...base,categories:[...grouped.values()].sort((a,b)=>a.category.localeCompare(b.category)),journal,warnings:[...warnings],total:roundMoney(sum(base.assets.map(a=>a.depreciation)),base.settings.reportingCurrency)};
}
export function filterVoucher(v:MonthlyVoucher,costCentre:string):MonthlyVoucher {return assemble({...v,costCentre,assets:v.assets.filter(a=>!costCentre||a.costCentre===costCentre),changes:v.changes.filter(a=>!costCentre||a.costCentre===costCentre)});}
export function voucherDifference(posted:PostedMonth,current:MonthlyVoucher){return roundMoney(current.total-posted.amount,current.settings.reportingCurrency);}
export function earlierOpenMonths(records:PostedMonth[],year:number,month:number){return Array.from({length:month-1},(_,i)=>i+1).filter(m=>!records.some(r=>r.year===year&&r.month===m));}
