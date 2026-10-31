import { type YearSchedule } from './depreciation';
import { type Settings, roundMoney } from './asset-model';
import { translate } from './i18n';
export type Journal={date:string;account:string;debit:number;credit:number;text:string;costCentre:string};
export function journalEntries(schedules:YearSchedule[],settings:Settings,monthly:boolean):Journal[]{
 const rows:Journal[]=[];
 const post=(s:YearSchedule,date:string,debit:string,credit:string,amount:number,text:string)=>{const n=roundMoney(Math.abs(amount),settings.reportingCurrency);if(!n)return;if(amount<0)[debit,credit]=[credit,debit];rows.push({date,account:debit,debit:n,credit:0,text,costCentre:s.costCentre},{date,account:credit,debit:0,credit:n,text,costCentre:s.costCentre});};
 for(const s of schedules){
  const mapping=settings.accounts[s.category];
  if(!mapping||Object.values(mapping).some(a=>!a.trim()))throw new Error(`${translate('Complete all ledger accounts for',settings.language)} ${s.category}.`);
  const reportYear=(s as YearSchedule&{reportYear?:number}).reportYear||new Date().getFullYear();
  const text=(key:string)=>`${translate(key,settings.language)} ${s.asset.asset_number||s.asset.description}`;
  if(monthly)for(let i=0;i<12;i++){const day=new Date(Date.UTC(reportYear,i+1,0)).getUTCDate();post(s,`${reportYear}-${String(i+1).padStart(2,'0')}-${day}`,mapping.expense,mapping.accumulated,s.displayMonths[i],text('Depreciation'));}
  else post(s,`${reportYear}-12-31`,mapping.expense,mapping.accumulated,s.yearDepreciation,text('Depreciation'));
  for(const movement of s.impairmentMovements||[{date:`${reportYear}-12-31`,amount:s.impairment}])post(s,movement.date,mapping.loss,mapping.accumulated,movement.amount,text('Impairment'));
  post(s,s.asset.purchase_date,mapping.cost,'ACQUISITION_CLEARING',s.additions,text('Acquisition'));
  if(s.costAdjustment!==undefined){post(s,`${reportYear}-01-01`,mapping.cost,'ADJUSTMENT_CLEARING',s.costAdjustment,text('Prior-period adjustment'));post(s,`${reportYear}-01-01`,'ADJUSTMENT_CLEARING',mapping.accumulated,s.accumulatedAdjustment||0,text('Prior-period adjustment'));}
  else post(s,`${reportYear}-01-01`,mapping.cost,'ADJUSTMENT_CLEARING',s.adjustment,text('Prior-period adjustment'));
  const movements=s.disposalMovements||[{date:s.asset.disposals_history?.filter(e=>e.date.startsWith(String(reportYear))).at(-1)?.date||`${reportYear}-12-31`,cost:s.costRemoved,accumulated:s.disposalAccumulatedRemoved,nbv:s.disposals,proceeds:s.proceeds,costs:s.disposalCosts,gainLoss:s.gainLoss}];
  for(const movement of movements){if(!movement.cost)continue;const {date}=movement;
   const cost=roundMoney(movement.cost,settings.reportingCurrency),accumulated=roundMoney(movement.accumulated,settings.reportingCurrency),nbv=cost-accumulated;
   const net=roundMoney(movement.proceeds-movement.costs,settings.reportingCurrency),gain=net-nbv;
   post(s,date,mapping.accumulated,mapping.cost,accumulated,text('Remove accumulated depreciation'));
   post(s,date,'DISPOSAL_CLEARING',mapping.cost,nbv,text('Remove net book value'));
   post(s,date,'PROCEEDS_CLEARING','DISPOSAL_CLEARING',net,text('Net disposal proceeds'));
   if(gain>=0)post(s,date,'DISPOSAL_CLEARING',mapping.gain,gain,text('Gain on disposal'));else post(s,date,mapping.loss,'DISPOSAL_CLEARING',-gain,text('Loss on disposal'));
  }
 }
 return rows.sort((a,b)=>a.date.localeCompare(b.date));
}
export function reconciliation(schedules:YearSchedule[],balances:Record<string,{cost:number;accumulated:number}>){const categories=[...new Set([...schedules.map(s=>s.category),...Object.keys(balances)])];return categories.map(category=>{const ss=schedules.filter(s=>s.category===category),cost=ss.reduce((n,s)=>n+s.closingCost,0),accumulated=ss.reduce((n,s)=>n+s.closingAccumulated,0),gl=balances[category]||{cost:0,accumulated:0};return {category,cost,accumulated,glCost:gl.cost,glAccumulated:gl.accumulated,costDifference:gl.cost-cost,accumulatedDifference:gl.accumulated-accumulated};});}
