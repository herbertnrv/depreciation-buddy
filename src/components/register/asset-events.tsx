import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Entry,Choice } from './asset-editor';
import { localAssets } from '@/lib/local-db';
import { computeYearSchedule, type AssetInput } from '@/lib/depreciation';
import { money, type Disposal } from '@/lib/asset-model';
import { useSettings, useUnsaved } from '@/lib/settings-context';
import { useT } from '@/lib/i18n';
import { ASSETS_QUERY_KEY } from '@/lib/use-assets';
export function AssetEvents({assets}:{assets:AssetInput[]}){
 const [open,setOpen]=useState(false),[category,setCategory]=useState(''),[id,setId]=useState(''),[mode,setMode]=useState('Dispose asset');
 const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10)),[type,setType]=useState<Disposal['type']>('Sale'),[pct,setPct]=useState('100'),[proceeds,setProceeds]=useState('0'),[costs,setCosts]=useState('0'),[reason,setReason]=useState(''),[amount,setAmount]=useState('0'),[reversal,setReversal]=useState(false),[newCategory,setNewCategory]=useState(''),[centre,setCentre]=useState('Hotel'),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const {settings}=useSettings(),t=useT(),qc=useQueryClient();const asset=assets.find(a=>a.id===id);const remaining=asset?1-(asset.disposals_history||[]).reduce((s,e)=>s+e.fraction,0):1;
 const event:Disposal={date,type,fraction:Number(pct)/100,proceeds:Number(proceeds),costs:Number(costs)};
 const calc=asset?computeYearSchedule({...asset,disposals_history:[...(asset.disposals_history||[]),event]},Number(date.slice(0,4)),settings):null;
 const existing=asset?computeYearSchedule(asset,Number(date.slice(0,4)),settings):null;
 useUnsaved(open&&!!id);
 const save=async()=>{if(!asset)return;setBusy(true);setError('');try{
  if(mode==='Dispose asset')await localAssets.update(asset.id,{disposals_history:[...(asset.disposals_history||[]),event],disposal_date:remaining-event.fraction<=1e-9?date:null});
  else if(mode==='Transfer / reclassify'){if(!newCategory.trim()||!date||date<asset.purchase_date||date>new Date().toISOString().slice(0,10))throw new Error('Enter a category and valid transfer date.');await localAssets.update(asset.id,{transfers:[...(asset.transfers||[]),{date,category:newCategory.trim(),cost_centre:centre}]});}
  else await localAssets.update(asset.id,{impairments:[...(asset.impairments||[]),{date,amount:Number(amount),reason,reversal}]});
  await qc.invalidateQueries({queryKey:ASSETS_QUERY_KEY,refetchType:'all'});setOpen(false);setId('');
 }catch(e){setError((e as Error).message);}finally{setBusy(false);}};
 return <><Button variant="outline" onClick={()=>{setOpen(true);setError('');}}>{t('Dispose asset')}</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{t(mode)}</DialogTitle></DialogHeader><div className="grid sm:grid-cols-2 gap-4">
 <Choice label="Action" value={mode} options={['Dispose asset','Transfer / reclassify','Impairment']} onChange={setMode}/><Choice label="Category" value={category} options={[...new Set(assets.map(a=>a.category))].sort()} onChange={v=>{setCategory(v);setId('');}}/>
 <Choice label="Assets" labels={Object.fromEntries(assets.map(a=>[a.id,`${a.asset_number||""} ${a.description}`]))} value={id} options={assets.filter(a=>a.category===category).map(a=>a.id)} onChange={setId}/><p className="self-end">{asset?.asset_number} {asset?.description}</p>
 <Entry label={mode==='Dispose asset'?'Disposal date':mode==='Transfer / reclassify'?'Transfer date':'Date'} type="date" value={date} onChange={setDate}/>
 {mode==='Dispose asset'&&<><Choice label="Disposal type" value={type} options={['Sale','Scrap','Donation','Loss/Theft']} onChange={v=>setType(v as Disposal['type'])}/><Entry label="Disposal percentage" type="number" value={pct} onChange={setPct}/><Entry label="Quantity" type="number" value={asset?(asset.quantity||1)*Number(pct)/100:0} onChange={v=>setPct(String(Number(v)/(asset?.quantity||1)*100))}/><Entry label="Sale proceeds" type="number" value={proceeds} onChange={setProceeds}/><Entry label="Disposal costs" type="number" value={costs} onChange={setCosts}/>
 {calc&&existing&&<dl className="col-span-full grid grid-cols-2 gap-2 border-y border-border py-3 text-sm">{[['Cost removed',calc.costRemoved-existing.costRemoved],['Accumulated depreciation removed',calc.disposalAccumulatedRemoved-existing.disposalAccumulatedRemoved],['NBV at disposal',calc.disposals-existing.disposals],['Sale proceeds',Number(proceeds)],['Disposal costs',Number(costs)],['Gain / (Loss) on disposal',Number(proceeds)-Number(costs)-(calc.disposals-existing.disposals)]].map(([label,n])=><div key={label} className="contents"><dt>{t(String(label))}</dt><dd className={`text-right font-mono ${Number(n)<0?'text-destructive':''}`}>{money(Number(n),settings.reportingCurrency)}</dd></div>)}</dl>}</>}
 {mode==='Transfer / reclassify'&&<><Entry label="New category" value={newCategory} onChange={setNewCategory}/><Choice label="New cost centre" value={centre} options={settings.costCentres} onChange={setCentre}/></>}
 {mode==='Impairment'&&<><Entry label="Amount" type="number" value={amount} onChange={setAmount}/><Entry label="Reason" value={reason} onChange={setReason}/><label className="flex gap-2 items-center"><input type="checkbox" checked={reversal} onChange={e=>setReversal(e.target.checked)}/>{t('Reversal')}</label></>}
 </div>{error&&<p role="alert" className="text-destructive">{error}</p>}<DialogFooter><Button variant="outline" onClick={()=>setOpen(false)}>{t('Cancel')}</Button><Button disabled={!asset||busy} onClick={save}>{t(mode==='Dispose asset'?'Confirm disposal':'Save')}</Button></DialogFooter></DialogContent></Dialog></>;
}
