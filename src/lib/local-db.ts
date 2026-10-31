import Dexie, { type Table } from 'dexie';
import { computeYearSchedule, normalizeAsset, scheduleVisible, type AssetInput, type YearSchedule } from './depreciation';
import { DEFAULT_SETTINGS, type Settings } from './asset-model';
export type AssetRecord = AssetInput & { created_at?: string; updated_at?: string };
export type NewAsset = Omit<AssetRecord, 'id' | 'created_at' | 'updated_at'>;
export type AuditEntry = { id: string; assetId: string; date: string; action: string; field: string; oldValue: unknown; newValue: unknown };
export type ClosedYear = { year: number; date: string; schedules: YearSchedule[]; settings: Settings };
export type Snapshot = { id: string; date: string; data: string };
export type LedgerBalances = Record<string,{cost:number;accumulated:number}>;
export type Count = { id: string; assetId: string; date: string; location: string; result: 'Found' | 'Missing' };
class GastronoAssetsDB extends Dexie {
  fixed_assets: Table<AssetRecord,string>; settings: Table<{id:string;value:Settings},string>;
  audit: Table<AuditEntry,string>; closed_years: Table<ClosedYear,number>; snapshots: Table<Snapshot,string>; counts: Table<Count,string>; reconciliation_balances:Table<{year:number;balances:LedgerBalances},number>;
  constructor() {
    super('gastrono_assets');
    this.version(1).stores({fixed_assets:'id, category, purchase_date, asset_number, location'});
    this.version(2).stores({ fixed_assets:'id, category, purchase_date, asset_number, location', settings:'id', audit:'id,assetId,date', closed_years:'year', snapshots:'id,date', counts:'id,assetId,location' }).upgrade(async tx=>{
      await tx.table('fixed_assets').toCollection().modify((a: AssetInput)=>Object.assign(a,normalizeAsset(a)));
      await tx.table('settings').put({id:'project',value:DEFAULT_SETTINGS});
    });
    this.version(3).stores({reconciliation_balances:'year'});
    this.reconciliation_balances=this.table('reconciliation_balances');
    this.fixed_assets=this.table('fixed_assets'); this.settings=this.table('settings'); this.audit=this.table('audit'); this.closed_years=this.table('closed_years'); this.snapshots=this.table('snapshots'); this.counts=this.table('counts');
  }
}
let instance: GastronoAssetsDB | undefined;
export function db() { if (typeof window==='undefined') throw new Error('Offline register is browser-only'); if (!instance) instance=new GastronoAssetsDB(); return instance; }
const uuid=()=>crypto.randomUUID();
const now=()=>new Date().toISOString();
export async function getSettings(): Promise<Settings> { const row=await db().settings.get('project'); return {...DEFAULT_SETTINGS,...row?.value}; }
export async function saveSettings(value: Settings) {
  await db().transaction('rw',db().settings,db().audit,db().closed_years,async()=>{
    const old=await getSettings(); const closed=await db().closed_years.count();
    if(closed && (old.reportingCurrency!==value.reportingCurrency || old.convention!==value.convention)) throw new Error('Reporting currency and convention are locked after the first year closing.');
    await db().settings.put({id:'project',value}); await logChanges('project','Settings',{...old},{...value});
  }); await automaticSnapshot();
}
async function logChanges(assetId:string, action:string, old:Record<string,unknown>, value:Record<string,unknown>) {
  const keys=new Set([...Object.keys(old),...Object.keys(value)]);
  const entries:AuditEntry[]=[];
  for(const field of keys) if(JSON.stringify(old[field])!==JSON.stringify(value[field])) entries.push({id:uuid(),assetId,date:now(),action,field,oldValue:old[field]??null,newValue:value[field]??null});
  await db().audit.bulkAdd(entries);
}
async function assertValid(asset: AssetInput, exceptId?:string, pending:AssetInput[]=[]) {
  if(!asset.description?.trim() || !asset.category?.trim()) throw new Error('Description and category are required.');
  if(!(asset.purchase_price>0) || !Number.isFinite(asset.purchase_price)) throw new Error('Purchase price must be greater than 0.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(asset.purchase_date) || !Number.isFinite(Date.parse(asset.purchase_date))) throw new Error('A valid purchase date is required.');
  if((asset.additional_costs||0)<0 || (asset.residual_value||0)<0 || (asset.residual_value||0)>asset.purchase_price+(asset.additional_costs||0)) throw new Error('Residual value must be between zero and total cost. Acquisition costs cannot be negative.');
  if(!(asset.exchange_rate && asset.exchange_rate>0)) throw new Error('Exchange rate must be positive.');
  if(asset.in_service_date && asset.in_service_date<asset.purchase_date) throw new Error('In-service date cannot precede purchase date.');
  if(asset.method!=='none' && !(asset.useful_life_months && asset.useful_life_months>0)) throw new Error('Useful life must be greater than zero.');
  const number=asset.asset_number?.trim().toLowerCase();
  if(number) { const rows=await db().fixed_assets.toArray(); if([...rows,...pending].some(a=>a.id!==exceptId && a.asset_number?.trim().toLowerCase()===number)) throw new Error(`Asset number "${asset.asset_number}" already exists. Choose Auto-number or enter a unique number.`); }
  let fraction=0;
  for(const e of asset.disposals_history||[]) {
    if(!e.date || e.date>now().slice(0,10) || e.date<asset.purchase_date) throw new Error('Disposal date must be between purchase date and today.');
    if(!(e.fraction>0 && e.fraction<=1) || e.proceeds<0 || e.costs<0) throw new Error('Disposal percentage must be positive; proceeds and costs cannot be negative.'); fraction+=e.fraction;
  }
  if(fraction>1+1e-9) throw new Error('Total disposals cannot exceed 100% of the original asset.');
  for(const e of asset.impairments||[]) if(!(e.amount>0)||!e.reason.trim()||e.date<asset.purchase_date||e.date>now().slice(0,10)) throw new Error('Impairment requires a positive amount, a reason, and a date between purchase and today.');
  const lastClosed=(await db().closed_years.orderBy('year').last())?.year;
  if(lastClosed!==undefined && !exceptId && Number(asset.purchase_date.slice(0,4))<=lastClosed) { /* late entries become next-period adjustments */ }
}
export async function automaticSnapshot() {
  const data=await backupData(); await db().snapshots.add({id:uuid(),date:now(),data:JSON.stringify(data)});
  const rows=await db().snapshots.orderBy('date').toArray(); await db().snapshots.bulkDelete(rows.slice(0,Math.max(0,rows.length-10)).map(s=>s.id));
}
async function backupData() { return {app:'GastronoAssets',version:3,exported_at:now(),fixed_assets:await db().fixed_assets.toArray(),settings:await getSettings(),audit:await db().audit.toArray(),closed_years:await db().closed_years.toArray(),counts:await db().counts.toArray(),reconciliation_balances:await db().reconciliation_balances.toArray()}; }
export const localAssets={
  async list():Promise<AssetInput[]> { const settings=await getSettings(); return (await db().fixed_assets.toArray()).map(a=>normalizeAsset(a,settings.reportingCurrency)).sort((a,b)=>a.category.localeCompare(b.category)||a.purchase_date.localeCompare(b.purchase_date)); },
  async insert(items:NewAsset|NewAsset[]):Promise<string> {
    const settings=await getSettings(), ts=now(); const rows=(Array.isArray(items)?items:[items]).map(a=>normalizeAsset({...a,id:uuid(),created_at:ts,updated_at:ts} as AssetRecord,settings.reportingCurrency));
    await db().transaction('rw',db().fixed_assets,db().audit,db().closed_years,async()=>{const pending:AssetInput[]=[];for(const a of rows){await assertValid(a,undefined,pending);pending.push(a);}await db().fixed_assets.bulkAdd(rows);for(const a of rows)await logChanges(a.id,'Create',{},a);}); await automaticSnapshot(); return rows[0]?.id||'';
  },
  async update(id:string, patch:Partial<NewAsset>) {
    await db().transaction('rw',db().fixed_assets,db().audit,db().closed_years,async()=>{const old=await db().fixed_assets.get(id);if(!old)throw new Error('Asset not found.');
      const next:AssetRecord={...normalizeAsset({...old,...patch}),updated_at:now()};
      if(patch.rate_per_year!==undefined && patch.useful_life_months===undefined) {next.useful_life_months=patch.rate_per_year>0?12/patch.rate_per_year:0;next.method=patch.rate_per_year>0?'straight-line':'none';}
      if(patch.disposal_date!==undefined && patch.disposals_history===undefined) next.disposals_history=patch.disposal_date?[{date:patch.disposal_date,type:'Sale',fraction:1,proceeds:0,costs:0}]:[];
      const closed=(await db().closed_years.orderBy('year').last())?.year;
      if(closed!==undefined) {
        for(const key of ['disposals_history','impairments','transfers'] as const) {
          const historical=(events:typeof next[typeof key])=>(events||[]).filter(e=>Number(e.date.slice(0,4))<=closed);
          if(JSON.stringify(historical(old[key]))!==JSON.stringify(historical(next[key]))) throw new Error('This period is closed. Date the new transaction in an open year.');
        }
      }
      await assertValid(next,id); await db().fixed_assets.put(next);await logChanges(id,'Edit',old,next);
    });await automaticSnapshot();
  },
  async remove(id:string) { await db().transaction('rw',db().fixed_assets,db().audit,async()=>{const old=await db().fixed_assets.get(id); if(old){await logChanges(id,'Delete',old,{});await db().fixed_assets.delete(id);}});await automaticSnapshot(); },
  async clear() { for(const a of await this.list())await this.remove(a.id); },
  async exportJson() { const settings=await getSettings(); settings.lastManualBackup=now();await db().settings.put({id:'project',value:settings});return JSON.stringify({...await backupData(),snapshots:await db().snapshots.toArray()},null,2); },
  async importJson(json:string,mode:'replace'|'merge'='merge') {
    const data=JSON.parse(json); if(!Array.isArray(data.fixed_assets)) throw new Error('Not a GastronoAssets backup.');
    const settings={...DEFAULT_SETTINGS,...data.settings}; const rows:AssetRecord[]=data.fixed_assets.map((a:AssetRecord)=>normalizeAsset({...a,id:a.id||uuid()},settings.reportingCurrency));
    for(const a of rows) if(!(a.purchase_price>0)||!a.category||!a.purchase_date)throw new Error('Backup contains an invalid asset. No data has been changed.');
    await automaticSnapshot();
    await db().transaction('rw',[db().fixed_assets,db().settings,db().audit,db().closed_years,db().counts,db().snapshots,db().reconciliation_balances],async()=>{
      if(mode==='replace') {await db().fixed_assets.clear();await db().audit.clear();await db().closed_years.clear();await db().counts.clear();await db().reconciliation_balances.clear();}
      await db().fixed_assets.bulkPut(rows); if(data.settings)await db().settings.put({id:'project',value:settings});
      if(data.audit)await db().audit.bulkPut(data.audit);if(data.closed_years)await db().closed_years.bulkPut(data.closed_years);if(data.counts)await db().counts.bulkPut(data.counts);
      if(data.reconciliation_balances)await db().reconciliation_balances.bulkPut(data.reconciliation_balances);
      if(data.snapshots)await db().snapshots.bulkPut(data.snapshots);await logChanges('project','Restore',{}, {mode,assets:rows.length});
    });await automaticSnapshot();return rows.length;
  }
};
export async function autoNumber(category:string) { const prefix=category.replace(/[^a-zA-Z]/g,'').slice(0,3).toUpperCase()||'AST';const assets=await localAssets.list();let n=1;while(assets.some(a=>a.asset_number===`${prefix}-${String(n).padStart(4,'0')}`))n++;return `${prefix}-${String(n).padStart(4,'0')}`; }
export async function schedulesForYear(year:number,settings?:Settings):Promise<YearSchedule[]> {
  const closed=await db().closed_years.get(year);if(closed)return closed.schedules;
  const prefs=settings||await getSettings();const assets=await localAssets.list();const live=assets.map(a=>computeYearSchedule(a,year,prefs));
  const prior=await db().closed_years.get(year-1);
  if(prior){for(const s of live){const old=prior.schedules.find(p=>p.asset.id===s.asset.id);const frozen=old?.closingNBV||0;s.costAdjustment=s.openingCost-(old?.closingCost||0);s.accumulatedAdjustment=s.openingAccumulated-(old?.closingAccumulated||0);s.adjustment=s.costAdjustment-s.accumulatedAdjustment;s.openingNBV=frozen;s.openingCost=old?.closingCost||0;s.openingAccumulated=old?.closingAccumulated||0;}
    for(const old of prior.schedules)if(old.closingNBV && !live.some(s=>s.asset.id===old.asset.id)) {const s=computeYearSchedule(old.asset,year,prefs); live.push({...s,openingNBV:old.closingNBV,openingCost:old.closingCost,openingAccumulated:old.closingAccumulated,months:Array(12).fill(0),displayMonths:Array(12).fill(0),yearDepreciation:0,additions:0,disposals:0,closingCost:0,closingAccumulated:0,closingNBV:0,adjustment:-old.closingNBV,costAdjustment:-old.closingCost,accumulatedAdjustment:-old.closingAccumulated,status:'Deleted — adjustment'});}}
  return live.filter(scheduleVisible);
}
export async function saveLedgerBalances(year:number,balances:LedgerBalances) {
 await db().reconciliation_balances.put({year,balances});await automaticSnapshot();
}
export async function closeYear(year:number) {
 await db().transaction('rw',[db().fixed_assets,db().settings,db().closed_years,db().audit,db().snapshots,db().counts,db().reconciliation_balances],async()=>{
  if(await db().closed_years.get(year))throw new Error('Year already closed.');
  const settings=await getSettings(),schedules=await schedulesForYear(year,settings);
  await db().closed_years.add({year,date:now(),settings,schedules});
  await logChanges('project','Close year',{}, {year});await automaticSnapshot();
 });
}
