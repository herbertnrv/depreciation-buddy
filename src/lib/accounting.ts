import { type YearSchedule } from './depreciation';
import { type Settings, roundMoney } from './asset-model';
export type Journal={date:string;account:string;debit:number;credit:number;text:string;costCentre:string};
export function journalEntries(schedules:YearSchedule[],settings:Settings,monthly:boolean):Journal[]{const rows:Journal[]=[];
 const post=(s:YearSchedule,date:string,debit:string,credit:string,amount:number,text:string)=>{const n=roundMoney(Math.abs(amount),settings.reportingCurrency);if(!n)return;if(amount<0)[debit,credit]=[credit,debit];rows.push({date,account:debit,debit:n,credit:0,text,costCentre:s.costCentre},{date,account:credit,debit:0,credit:n,text,costCentre:s.costCentre});};
 for(const s of schedules){const mapping=settings.accounts[s.category];if(!mapping||Object.values(mapping).some(a=>!a.trim()))throw new Error(`Complete all ledger accounts for ${s.category} in Settings.`);
 const reportYear=(s as YearSchedule&{reportYear?:number}).reportYear||new Date().getFullYear();
 const label=`${s.asset.asset_number||s.asset.description}`;
 if(monthly)for(let i=0;i<12;i++){const day=new Date(Date.UTC(reportYear,i+1,0)).getUTCDate();post(s,`${reportYear}-${String(i+1).padStart(2,'0')}-${day}`,mapping.expense,mapping.accumulated,s.displayMonths[i],`Depreciation ${label}`);}
 else post(s,`${reportYear}-12-31`,mapping.expense,mapping.accumulated,s.yearDepreciation,`Depreciation ${label}`);
 post(s,`${reportYear}-12-31`,mapping.loss,mapping.accumulated,s.impairment,`Impairment ${label}`);
 // Acquisition settlement and proceeds use explicit clearing accounts, since counterparty cash/AP is not configured.
 post(s,s.asset.purchase_date,mapping.cost,'ACQUISITION_CLEARING',s.additions,`Acquisition ${label}`);
 post(s,`${reportYear}-01-01`,mapping.cost,'ADJUSTMENT_CLEARING',s.adjustment,`Prior-period adjustment ${label}`);
 if(s.costRemoved){const date=s.asset.disposals_history?.filter(e=>e.date.startsWith(String(reportYear))).at(-1)?.date||`${reportYear}-12-31`;
  post(s,date,mapping.accumulated,mapping.cost,s.disposalAccumulatedRemoved,`Remove accumulated depreciation ${label}`);
  post(s,date,'DISPOSAL_CLEARING',mapping.cost,s.disposals,`Remove net book value ${label}`);
  const net=s.proceeds-s.disposalCosts;post(s,date,'PROCEEDS_CLEARING','DISPOSAL_CLEARING',net,`Net disposal proceeds ${label}`);
  if(s.gainLoss>=0)post(s,date,'DISPOSAL_CLEARING',mapping.gain,s.gainLoss,`Gain on disposal ${label}`);else post(s,date,mapping.loss,'DISPOSAL_CLEARING',-s.gainLoss,`Loss on disposal ${label}`);
 }
 }
 return rows.sort((a,b)=>a.date.localeCompare(b.date));
}
export function reconciliation(schedules:YearSchedule[],balances:Record<string,{cost:number;accumulated:number}>){const categories=[...new Set(schedules.map(s=>s.category))];return categories.map(category=>{const ss=schedules.filter(s=>s.category===category),cost=ss.reduce((n,s)=>n+s.closingCost,0),accumulated=ss.reduce((n,s)=>n+s.closingAccumulated,0),gl=balances[category]||{cost:0,accumulated:0};return {category,cost,accumulated,glCost:gl.cost,glAccumulated:gl.accumulated,costDifference:gl.cost-cost,accumulatedDifference:gl.accumulated-accumulated};});}
