import { type YearSchedule,type CategoryMovement } from './depreciation';
import { type Settings, roundMoney } from './asset-model';
import { translate } from './i18n';
export type Journal={date:string;account:string;debit:number;credit:number;text:string;costCentre:string};
export function journalEntries(schedules:YearSchedule[],settings:Settings,monthly:boolean):Journal[]{
 const rows:Journal[]=[];
 const post=(s:YearSchedule,date:string,debit:string,credit:string,amount:number,text:string)=>{const n=roundMoney(Math.abs(amount),settings.reportingCurrency);if(!n)return;if(amount<0)[debit,credit]=[credit,debit];rows.push({date,account:debit,debit:n,credit:0,text,costCentre:s.costCentre},{date,account:credit,debit:0,credit:n,text,costCentre:s.costCentre});};
 for(const s of schedules){
  const categoryAt=(date:string)=>s.depreciationCategories?.[Number(date.slice(5,7))-1]||s.category;
  const mapping=settings.accounts[s.category];
  for(const category of new Set([s.category,s.asset.category,...(s.depreciationCategories||[])])){const accounts=settings.accounts[category];if(!accounts||(['cost','accumulated','expense','gain','loss'] as const).some(k=>!accounts[k]?.trim()))throw new Error(`${translate('Complete all ledger accounts for',settings.language)} ${category}.`);}
  if(!mapping||(['cost','accumulated','expense','gain','loss'] as const).some(k=>!mapping[k]?.trim()))throw new Error(`${translate('Complete all ledger accounts for',settings.language)} ${s.category}.`);
  const reportYear=(s as YearSchedule&{reportYear?:number}).reportYear||new Date().getFullYear();
  const text=(key:string)=>`${translate(key,settings.language)} ${s.asset.asset_number||s.asset.description}`;
  if(monthly)for(let i=0;i<12;i++){const day=new Date(Date.UTC(reportYear,i+1,0)).getUTCDate();const m=settings.accounts[s.depreciationCategories?.[i]||s.category];if(!m&&s.displayMonths[i])throw new Error(`${translate('Complete all ledger accounts for',settings.language)} ${s.depreciationCategories?.[i]}.`);post(s,`${reportYear}-${String(i+1).padStart(2,'0')}-${day}`,m?.expense||mapping.expense,m?.accumulated||mapping.accumulated,s.displayMonths[i],text('Depreciation'));}
  else {const totals=new Map<string,number>();for(let i=0;i<12;i++){const category=s.depreciationCategories?.[i]||s.category;totals.set(category,(totals.get(category)||0)+s.displayMonths[i]);}for(const [category,amount] of totals){const m=settings.accounts[category];if(m)post(s,`${reportYear}-12-31`,m.expense,m.accumulated,amount,text('Depreciation'));}}
  for(const movement of s.impairmentMovements||[{date:`${reportYear}-12-31`,amount:s.impairment}]){const m=settings.accounts[categoryAt(movement.date)]||mapping;post(s,movement.date,m.loss,m.accumulated,movement.amount,text('Impairment'));}
  for(const movement of s.transferMovements||[]){const from=settings.accounts[movement.from],to=settings.accounts[movement.to];if(!from||!to)throw new Error(`${translate('Complete all ledger accounts for',settings.language)} ${movement.from} / ${movement.to}.`);post(s,movement.date,to.cost,from.cost,movement.cost,text('Transfer'));post(s,movement.date,from.accumulated,to.accumulated,movement.accumulated,text('Transfer'));}
  const acquisition=settings.accounts[s.asset.category]||mapping;
  post(s,s.asset.purchase_date,acquisition.cost,'ACQUISITION_CLEARING',s.additions,text('Acquisition'));
  if(s.costAdjustment!==undefined){post(s,`${reportYear}-01-01`,mapping.cost,'ADJUSTMENT_CLEARING',s.costAdjustment,text('Prior-period adjustment'));post(s,`${reportYear}-01-01`,'ADJUSTMENT_CLEARING',mapping.accumulated,s.accumulatedAdjustment||0,text('Prior-period adjustment'));}
  else post(s,`${reportYear}-01-01`,mapping.cost,'ADJUSTMENT_CLEARING',s.adjustment,text('Prior-period adjustment'));
  const movements=s.disposalMovements||[{date:s.asset.disposals_history?.filter(e=>e.date.startsWith(String(reportYear))).at(-1)?.date||`${reportYear}-12-31`,cost:s.costRemoved,accumulated:s.disposalAccumulatedRemoved,nbv:s.disposals,proceeds:s.proceeds,costs:s.disposalCosts,gainLoss:s.gainLoss}];
  for(const movement of movements){if(!movement.cost)continue;const {date}=movement;const disposalMapping=settings.accounts[categoryAt(date)]||mapping;
   const cost=roundMoney(movement.cost,settings.reportingCurrency),accumulated=roundMoney(movement.accumulated,settings.reportingCurrency),nbv=cost-accumulated;
   const net=roundMoney(movement.proceeds-movement.costs,settings.reportingCurrency),gain=net-nbv;
   post(s,date,disposalMapping.accumulated,mapping.cost,accumulated,text('Remove accumulated depreciation'));
   post(s,date,'DISPOSAL_CLEARING',disposalMapping.cost,nbv,text('Remove net book value'));
   post(s,date,'PROCEEDS_CLEARING','DISPOSAL_CLEARING',net,text('Net disposal proceeds'));
   if(gain>=0)post(s,date,'DISPOSAL_CLEARING',disposalMapping.gain,gain,text('Gain on disposal'));else post(s,date,disposalMapping.loss,'DISPOSAL_CLEARING',-gain,text('Loss on disposal'));
  }
 }
 return rows.sort((a,b)=>a.date.localeCompare(b.date));
}
export function reconciliation(schedules:YearSchedule[],balances:Record<string,{cost:number;accumulated:number}>){const categories=[...new Set([...schedules.map(s=>s.category),...Object.keys(balances)])];return categories.map(category=>{const ss=schedules.filter(s=>s.category===category),cost=ss.reduce((n,s)=>n+s.closingCost,0),accumulated=ss.reduce((n,s)=>n+s.closingAccumulated,0),gl=balances[category]||{cost:0,accumulated:0};return {category,cost,accumulated,glCost:gl.cost,glAccumulated:gl.accumulated,costDifference:gl.cost-cost,accumulatedDifference:gl.accumulated-accumulated};});}

export function categoryRollforward(schedules:YearSchedule[]):CategoryMovement[]{
 const rows=new Map<string,CategoryMovement>();
 for(const schedule of schedules){const movements=schedule.categoryMovements||[{category:schedule.category,openingCost:schedule.openingCost,openingAccumulated:schedule.openingAccumulated,openingNBV:schedule.openingNBV,additions:schedule.additions+schedule.adjustment,transfersIn:0,transfersOut:0,disposals:schedule.disposals,depreciation:schedule.yearDepreciation,impairment:schedule.impairment,closingCost:schedule.closingCost,closingAccumulated:schedule.closingAccumulated,closingNBV:schedule.closingNBV}];
  for(const movement of movements){const old=rows.get(movement.category);if(!old)rows.set(movement.category,{...movement});else for(const key of Object.keys(movement) as (keyof CategoryMovement)[])if(key!=='category')old[key]+=movement[key];}
 }
 return [...rows.values()].sort((a,b)=>a.category.localeCompare(b.category));
}
