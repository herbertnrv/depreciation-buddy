import { it,expect } from 'vitest';
import { computeYearSchedule,type AssetInput } from './depreciation';
import { DEFAULT_SETTINGS } from './asset-model';
import { journalEntries,reconciliation,categoryRollforward } from './accounting';
const a:AssetInput={id:'a',asset_number:'A',category:'Equipment',description:'Test',location:null,purchase_date:'2026-03-15',purchase_price:100000000,rate_per_year:.2,disposal_date:null,disposals_history:[{date:'2026-07-15',fraction:1,type:'Sale',proceeds:95000000,costs:1000000}]};
const settings={...DEFAULT_SETTINGS,accounts:{Equipment:{cost:'1500',accumulated:'1590',expense:'6000',gain:'7100',loss:'7200'}}};
it('journal debit and credit balance, including disposal gain',()=>{const s={...computeYearSchedule(a,2026),reportYear:2026};const entries=journalEntries([s],settings,true);expect(entries.reduce((n,e)=>n+e.debit-e.credit,0)).toBe(0);expect(entries.find(e=>e.account==='7100')?.credit).toBe(Math.round(s.gainLoss));expect(entries.every(e=>e.date.startsWith('2026'))).toBe(true);});
it('GL reconciliation returns exact differences',()=>{const s=computeYearSchedule({...a,disposals_history:[]},2026);const rows=reconciliation([s],{Equipment:{cost:100000001,accumulated:s.closingAccumulated}});expect(rows[0].costDifference).toBe(1);expect(rows[0].accumulatedDifference).toBe(0);});
it('two partial disposals preserve each transaction date and remove half the original cost',()=>{
 const s={...computeYearSchedule({...a,disposals_history:[{date:'2026-06-15',fraction:.25,type:'Sale',proceeds:24000000,costs:0},{date:'2026-09-15',fraction:.25,type:'Sale',proceeds:23000000,costs:0}]},2026),reportYear:2026};
 expect(s.costRemoved).toBe(50000000);expect(s.disposalMovements).toHaveLength(2);
 expect(s.disposalMovements?.reduce((n,e)=>n+e.nbv,0)).toBe(s.disposals);
 const entries=journalEntries([s],settings,true);
 for(const date of ['2026-06-15','2026-09-15']){const event=entries.filter(e=>e.date===date);expect(event.length).toBeGreaterThan(0);expect(event.reduce((n,e)=>n+e.debit-e.credit,0)).toBe(0);expect(event.filter(e=>e.account==='1500').reduce((n,e)=>n+e.credit,0)).toBe(25000000);expect(event.filter(e=>e.account==='DISPOSAL_CLEARING').reduce((n,e)=>n+e.debit-e.credit,0)).toBe(0);}
});
it('category transfer preserves total NBV and reconciles both categories',()=>{
 const s={...computeYearSchedule({...a,disposals_history:[],transfers:[{date:'2026-07-01',category:'Kitchen',cost_centre:'Restaurant'}]},2026),reportYear:2026};
 const rows=categoryRollforward([s]);expect(rows.map(r=>r.category)).toEqual(['Equipment','Kitchen']);
 const source=rows.find(r=>r.category==='Equipment'),target=rows.find(r=>r.category==='Kitchen');
 expect(source?.transfersOut).toBe(target?.transfersIn);expect(source?.transfersOut).toBeGreaterThan(0);
 for(const r of rows)expect(r.openingNBV+r.additions+r.transfersIn-r.transfersOut-r.disposals-r.depreciation-r.impairment).toBeCloseTo(r.closingNBV);
 expect(rows.reduce((n,r)=>n+r.closingNBV,0)).toBe(s.closingNBV);
 const entries=journalEntries([s],{...settings,accounts:{...settings.accounts,Kitchen:{cost:'1510',accumulated:'1591',expense:'6001',gain:'7101',loss:'7201'}}},true);
 expect(entries.some(e=>e.date==='2026-07-01'&&e.account==='1510'&&e.debit===100000000)).toBe(true);
 expect(entries.some(e=>e.date==='2026-06-30'&&e.account==='6000')).toBe(true);expect(entries.some(e=>e.date==='2026-07-31'&&e.account==='6001')).toBe(true);
});
it('impairment journals retain the actual transaction date',()=>{
 const s={...computeYearSchedule({...a,disposals_history:[],impairments:[{date:'2026-05-10',amount:1000000,reason:'Damage'}]},2026),reportYear:2026};
 expect(journalEntries([s],settings,true).find(e=>e.text.startsWith('Impairment'))?.date).toBe('2026-05-10');
});
