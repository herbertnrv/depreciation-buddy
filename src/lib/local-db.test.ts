import 'fake-indexeddb/auto';
import { beforeAll, it, expect } from 'vitest';
import Dexie from 'dexie';
import { db, localAssets, getSettings, closeYear, schedulesForYear,saveLedgerBalances } from './local-db';
import { postMonth,reopenMonth } from './local-db';
import { createVoucher,voucherDifference } from './monthly-voucher';
const legacy={id:'old',asset_number:'EQ-001',category:'Equipment',description:'Legacy fixture',location:'Hotel',purchase_date:'2026-03-15',purchase_price:100000000,rate_per_year:.2,disposal_date:null};
beforeAll(async()=>{Object.defineProperty(globalThis,'window',{value:{},configurable:true});const old=new Dexie('gastrono_assets');old.version(1).stores({fixed_assets:'id, category, purchase_date, asset_number, location'});await old.table('fixed_assets').put(legacy);old.close();});
it('v1 database upgrades without losing records',async()=>{const a=(await localAssets.list())[0];expect(a.description).toBe('Legacy fixture');expect(a.residual_value).toBe(0);expect(a.in_service_date).toBe('2026-03-15');expect((await getSettings()).reportingCurrency).toBe('LAK');});
it('duplicate asset numbers are blocked',async()=>{await expect(localAssets.insert({...legacy,id:undefined} as never)).rejects.toThrow('already exists');});
it('closed year is immutable and following year shows adjustment',async()=>{await closeYear(2026);const frozen=await schedulesForYear(2026);await localAssets.update('old',{purchase_price:120000000});expect((await schedulesForYear(2026))[0].closingNBV).toBe(frozen[0].closingNBV);const next=(await schedulesForYear(2027))[0];expect(next.openingNBV).toBe(frozen[0].closingNBV);expect(next.adjustment).toBeCloseTo(16666666.66666667);});
it('audit and last 10 snapshots are included in backup',async()=>{for(let i=0;i<12;i++)await localAssets.update('old',{supplier:`Supplier ${i}`});const backup=JSON.parse(await localAssets.exportJson());expect(backup.snapshots).toHaveLength(10);expect(backup.audit.some((e:{field:string})=>e.field==='supplier')).toBe(true);expect(backup.closed_years).toHaveLength(1);});
it('backup restoration keeps old and current data',async()=>{await localAssets.importJson(JSON.stringify({fixed_assets:[legacy]}),'merge');expect((await localAssets.list())[0].residual_value).toBe(0);});
it('closed historical events cannot be removed',async()=>{
 await db().fixed_assets.put({...legacy,impairments:[{date:'2026-05-01',amount:1000,reason:'Damage'}]});
 await expect(localAssets.update('old',{impairments:[]})).rejects.toThrow('period is closed');
 expect((await db().fixed_assets.get('old'))?.impairments).toHaveLength(1);
});
it('reconciliation balances persist by year and survive JSON restore',async()=>{
 await saveLedgerBalances(2026,{Equipment:{cost:100000000,accumulated:5000000}});await saveLedgerBalances(2027,{Equipment:{cost:100000000,accumulated:25000000}});
 const backup=await localAssets.exportJson();await db().reconciliation_balances.clear();await localAssets.importJson(backup,'replace');
 expect((await db().reconciliation_balances.get(2026))?.balances.Equipment.accumulated).toBe(5000000);
 expect((await db().reconciliation_balances.get(2027))?.balances.Equipment.accumulated).toBe(25000000);
});
it('repeat closing is rejected without changing the frozen schedule',async()=>{
 const old=JSON.stringify(await db().closed_years.get(2026));await expect(closeYear(2026)).rejects.toThrow('already closed');expect(JSON.stringify(await db().closed_years.get(2026))).toBe(old);
});
it('posted month freezes amounts after master edits and flags recalculation difference',async()=>{
 await postMonth(2027,3,'HL');const posted=await db().posted_months.get('2027-03');expect(posted?.initials).toBe('HL');const frozen=JSON.stringify(posted);
 await localAssets.update('old',{purchase_price:150000000});expect(JSON.stringify(await db().posted_months.get('2027-03'))).toBe(frozen);
 const current=createVoucher(await schedulesForYear(2027),2027,3,await getSettings());if(!posted)throw new Error('Missing posted month');expect(voucherDifference(posted,current)).not.toBe(0);
 await expect(postMonth(2027,3,'HL')).rejects.toThrow('already posted');
});
it('posted months survive replace backup and legacy merge cannot overwrite frozen record',async()=>{
 const backup=await localAssets.exportJson();const old=JSON.stringify(await db().posted_months.get('2027-03'));await db().posted_months.clear();await localAssets.importJson(backup,'replace');expect(JSON.stringify(await db().posted_months.get('2027-03'))).toBe(old);
 await localAssets.importJson(JSON.stringify({fixed_assets:[]}), 'merge');expect(JSON.stringify(await db().posted_months.get('2027-03'))).toBe(old);
});
it('reopening requires initials, logs action and permits reposting',async()=>{
 await expect(reopenMonth('2027-03','')).rejects.toThrow('initials');await reopenMonth('2027-03','HL');expect(await db().posted_months.get('2027-03')).toBeUndefined();expect((await db().audit.toArray()).some(a=>a.action==='Reopen month'&&a.assetId==='2027-03')).toBe(true);await postMonth(2027,3,'HL2');expect((await db().posted_months.get('2027-03'))?.initials).toBe('HL2');
});
