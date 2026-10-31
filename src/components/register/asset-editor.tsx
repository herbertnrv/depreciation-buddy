import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { autoNumber, localAssets } from '@/lib/local-db';
import { normalizeAsset, totalCost, type AssetInput } from '@/lib/depreciation';
import { useSettings, useUnsaved } from '@/lib/settings-context';
import { useT } from '@/lib/i18n';
import { money } from '@/lib/asset-model';
import { ASSETS_QUERY_KEY } from '@/lib/use-assets';
import { toast } from 'sonner';
export function Entry({label,value,onChange,type='text'}:{label:string;value:string|number;onChange:(s:string)=>void;type?:string}){const t=useT();return <Label className="grid gap-1.5">{t(label)}<Input aria-label={t(label)} value={value} type={type} onChange={e=>onChange(e.target.value)}/></Label>;}
export function Choice({label,value,options,onChange,labels}:{label:string;value:string;options:string[];onChange:(v:string)=>void;labels?:Record<string,string>}){const t=useT();return <Label className="grid gap-1.5">{t(label)}<Select value={value} onValueChange={onChange}><SelectTrigger aria-label={t(label)}><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem value={o} key={o}>{labels?.[o]||t(o)}</SelectItem>)}</SelectContent></Select></Label>;}
function fresh(currency:string):AssetInput{return normalizeAsset({id:'',asset_number:null,category:'Furniture',description:'',location:null,purchase_date:new Date().toISOString().slice(0,10),purchase_price:0,rate_per_year:.2,disposal_date:null,currency});}
export function AssetEditor({open,onClose,asset,assets}:{open:boolean;onClose:()=>void;asset:AssetInput|null;assets:AssetInput[]}) {
 const {settings}=useSettings(),t=useT(),qc=useQueryClient();const [form,setForm]=useState(()=>fresh(settings.reportingCurrency));const [initial,setInitial]=useState('');const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{if(open){const value=asset?normalizeAsset(asset,settings.reportingCurrency):fresh(settings.reportingCurrency);setForm(value);setInitial(JSON.stringify(value));setError('');}},[open,asset,settings.reportingCurrency]);
 const dirty=open&&JSON.stringify(form)!==initial;useUnsaved(dirty);
 const set=(key:keyof AssetInput,value:unknown)=>setForm(p=>({...p,[key]:value}));
 const close=()=>{if(!dirty||window.confirm(settings.language==='DE'?'Ungespeicherte Änderungen verwerfen?':'Discard unsaved changes?'))onClose();};
 const save=async()=>{setBusy(true);setError('');try{if(asset)await localAssets.update(asset.id,form);else await localAssets.insert(form);await qc.invalidateQueries({queryKey:ASSETS_QUERY_KEY,refetchType:'all'});toast.success(t('Saved'));onClose();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
 const numberField=(key:keyof AssetInput,label:string)=><Entry label={label} value={Number(form[key]||0)} type="number" onChange={v=>set(key,Number(v))}/>;
 return <Dialog open={open} onOpenChange={v=>{if(!v)close();}}><DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{t(asset?'Edit asset':'New asset')}</DialogTitle></DialogHeader>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Label className="grid gap-1.5">{t('Category')}<Input aria-label={t('Category')} list="existing-categories" value={form.category} onChange={e=>{set('category',e.target.value);if(/^(land|grundstück)$/i.test(e.target.value)){set('method','none');set('rate_per_year',0);}}}/><datalist id="existing-categories">{[...new Set(assets.map(a=>a.category))].map(c=><option key={c} value={c}/>)}</datalist></Label>
 <div className="flex items-end gap-2"><Entry label="Asset number" value={form.asset_number||''} onChange={v=>set('asset_number',v)}/><Button variant="outline" onClick={async()=>set('asset_number',await autoNumber(form.category))}>{t('Auto-number')}</Button></div>
 <Entry label="Description" value={form.description} onChange={v=>set('description',v)}/><Entry label="Location" value={form.location||''} onChange={v=>set('location',v)}/>
 <Entry label="Purchase date" type="date" value={form.purchase_date} onChange={v=>{set('purchase_date',v);if(form.in_service_date===form.purchase_date)set('in_service_date',v);}}/>
 <Entry label="In service since" type="date" value={form.in_service_date||''} onChange={v=>set('in_service_date',v)}/>
 {numberField('purchase_price','Purchase price')}{numberField('additional_costs','Additional acquisition costs')}{numberField('residual_value','Residual value')}
 <Choice label="Depreciation method" value={form.method==='straight-line'?'Straight-line':form.method==='declining-balance'?'Declining balance':'No depreciation'} options={['Straight-line','Declining balance','No depreciation']} onChange={v=>set('method',v==='Straight-line'?'straight-line':v==='Declining balance'?'declining-balance':'none')}/>
 <Entry label="Useful life (months)" type="number" value={form.useful_life_months||0} onChange={v=>{set('useful_life_months',Number(v));set('rate_per_year',Number(v)>0?12/Number(v):0);}}/>
 <Choice label="Useful life (months)" value={String(form.useful_life_months||60)} options={[...new Set(['12','24','60','120','240',String(form.useful_life_months||60)])]} onChange={v=>{set('useful_life_months',Number(v));set('rate_per_year',12/Number(v));}}/>
 <Entry label="Rate" type="number" value={Number((form.rate_per_year*100).toFixed(8))} onChange={v=>{set('rate_per_year',Number(v)/100);set('useful_life_months',Number(v)>0?1200/Number(v):0);}}/>
 {form.method==='declining-balance'&&numberField('declining_factor','Declining factor')}
 <Entry label="Currency" value={form.currency||settings.reportingCurrency} onChange={v=>set('currency',v.toUpperCase())}/>{numberField('exchange_rate','Exchange rate')}
 <Entry label="Supplier" value={form.supplier||''} onChange={v=>set('supplier',v)}/><Entry label="Invoice number" value={form.invoice_number||''} onChange={v=>set('invoice_number',v)}/>
 <Choice label="Cost centre" value={form.cost_centre||'Hotel'} options={[...new Set([...settings.costCentres,form.cost_centre||'Hotel'])]} onChange={v=>set('cost_centre',v)}/>{numberField('quantity','Quantity')}
 <Label className="flex items-center gap-2"><input type="checkbox" checked={!!form.under_construction} onChange={e=>set('under_construction',e.target.checked)}/>{t('Under construction')}</Label>
 <p className="text-right font-mono">{t('Total cost')}: {money(totalCost(form),settings.reportingCurrency)} {settings.reportingCurrency}</p>
 {totalCost(form)<settings.threshold&&<p className="text-destructive col-span-full">{t('Low-value, expense directly')}</p>}
 <Label className="grid gap-2 col-span-full">{t('Notes')}<Textarea value={form.notes||''} onChange={e=>set('notes',e.target.value)}/></Label>
 <Label className="grid gap-2 col-span-full">{t('Attachments')}<Input aria-label={t('Attachments')} type="file" multiple accept="image/*,.pdf" onChange={async e=>{const files=Array.from(e.target.files||[]);try{const attachments=await Promise.all(files.map(file=>new Promise<{name:string;type:string;data:string}>((resolve,reject)=>{if(file.size>10*1024*1024){reject(new Error('Maximum attachment size is 10 MB.'));return;}const r=new FileReader();r.onload=()=>resolve({name:file.name,type:file.type,data:String(r.result)});r.onerror=()=>reject(r.error);r.readAsDataURL(file);})));set('attachments',[...(form.attachments||[]),...attachments]);}catch(e){setError((e as Error).message);}}}/>
 {(form.attachments||[]).map((a,i)=><div className="flex justify-between" key={`${a.name}-${i}`}><a href={a.data} download={a.name} className="underline">{a.name}</a><Button variant="ghost" size="sm" onClick={()=>set('attachments',form.attachments?.filter((_,n)=>n!==i))}>{t('Delete')}</Button></div>)}</Label>
 </div>{error&&<p role="alert" className="text-destructive">{error}</p>}
 <DialogFooter><Button variant="outline" onClick={close}>{t('Cancel')}</Button><Button onClick={save} disabled={busy}>{t('Save')}</Button></DialogFooter></DialogContent></Dialog>;
}
