import { it,expect } from 'vitest';
import { computeYearSchedule,type AssetInput } from './depreciation';
import { DEFAULT_SETTINGS } from './asset-model';
import { journalEntries,reconciliation } from './accounting';
const a:AssetInput={id:'a',asset_number:'A',category:'Equipment',description:'Test',location:null,purchase_date:'2026-03-15',purchase_price:100000000,rate_per_year:.2,disposal_date:null,disposals_history:[{date:'2026-07-15',fraction:1,type:'Sale',proceeds:95000000,costs:1000000}]};
const settings={...DEFAULT_SETTINGS,accounts:{Equipment:{cost:'1500',accumulated:'1590',expense:'6000',gain:'7100',loss:'7200'}}};
it('journal debit and credit balance, including disposal gain',()=>{const s={...computeYearSchedule(a,2026),reportYear:2026};const entries=journalEntries([s],settings,true);expect(entries.reduce((n,e)=>n+e.debit-e.credit,0)).toBe(0);expect(entries.find(e=>e.account==='7100')?.credit).toBe(Math.round(s.gainLoss));expect(entries.every(e=>e.date.startsWith('2026'))).toBe(true);});
it('GL reconciliation returns exact differences',()=>{const s=computeYearSchedule({...a,disposals_history:[]},2026);const rows=reconciliation([s],{Equipment:{cost:100000001,accumulated:s.closingAccumulated}});expect(rows[0].costDifference).toBe(1);expect(rows[0].accumulatedDifference).toBe(0);});
