import { AssetEditor } from '@/components/register/asset-editor';
import { AssetEvents } from '@/components/register/asset-events';
import { AuditDialog } from '@/components/register/audit-dialog';
import { useSettings } from '@/lib/settings-context';
import { useT } from '@/lib/i18n';
import { money, dateLabel } from '@/lib/asset-model';
import { totalCost } from '@/lib/depreciation';
import { exportAllExcel } from '@/lib/report-export';
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localAssets } from "@/lib/local-db";
import { ASSETS_QUERY_KEY, useAssets } from "@/lib/use-assets";
import type { AssetInput } from "@/lib/depreciation";
import { formatMoney, computeYearSchedule } from "@/lib/depreciation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, AlertCircle, Download, FolderUp, PackageMinus } from "lucide-react";
import { parseAssetWorkbook, type ParsedAsset } from "@/lib/import-xlsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export const Route = createFileRoute('/_app/assets')({
  head:()=>({meta:[{title:'GastronoAssets | Assets'},{name:'description',content:'Offline asset master data, acquisition costs, disposals and audit trail.'},{property:'og:title',content:'GastronoAssets | Assets'},{property:'og:description',content:'Offline asset management for hotel and gastronomy.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component:AssetsPage,
});

function AssetsPage() {
  const {data:assets=[],isLoading}=useAssets(); const [open,setOpen]=useState(false),[editing,setEditing]=useState<AssetInput|null>(null);const qc=useQueryClient();const {settings}=useSettings(),t=useT();
  const [purchasedFrom,setPurchasedFrom]=useState(''),[purchasedTo,setPurchasedTo]=useState('');
  const invalidRange=Boolean(purchasedFrom&&purchasedTo&&purchasedTo<purchasedFrom);
  const visibleAssets=invalidRange?[]:assets.filter(a=>(!purchasedFrom||a.purchase_date>=purchasedFrom)&&(!purchasedTo||a.purchase_date<=purchasedTo));
  return <div className="space-y-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-2xl font-semibold">{t('Assets')}</h2><div className="flex flex-wrap gap-2"><BackupButton/><RestoreButton/><ImportButton/><Button variant="outline" onClick={()=>exportAllExcel(assets,settings)}>{t('Export all data as Excel')}</Button><AuditDialog/><AssetEvents assets={assets}/><Button onClick={()=>{setEditing(null);setOpen(true);}}><Plus className="size-4 mr-2"/>{t('Add asset')}</Button></div></div>
  <div className="flex flex-wrap items-end gap-3">
    <div className="space-y-1"><Label htmlFor="purchased-from">{t('Purchased from')}</Label><Input id="purchased-from" type="date" value={purchasedFrom} max={purchasedTo||undefined} onChange={e=>setPurchasedFrom(e.target.value)} className="w-44"/><p className="text-xs text-muted-foreground">{dateLabel(purchasedFrom)}</p></div>
    <div className="space-y-1"><Label htmlFor="purchased-to">{t('Purchased to')}</Label><Input id="purchased-to" type="date" value={purchasedTo} min={purchasedFrom||undefined} onChange={e=>setPurchasedTo(e.target.value)} className="w-44"/><p className="text-xs text-muted-foreground">{dateLabel(purchasedTo)}</p></div>
    <Button variant="outline" className="mb-5" disabled={!purchasedFrom&&!purchasedTo} onClick={()=>{setPurchasedFrom('');setPurchasedTo('');}}>{t('Clear')}</Button>
    <p className="text-sm text-muted-foreground mb-5" aria-live="polite">{t('Number of assets')}: {visibleAssets.length} / {assets.length}</p>
  </div>
  {invalidRange&&<p role="alert" className="text-sm text-destructive">{t('The end date must not precede the start date.')}</p>}
  {isLoading&&<p>{t('Loading…')}</p>}
  <div className="overflow-auto border border-border rounded-md"><table className="w-full text-sm"><thead className="bg-muted"><tr>{['Category','Asset number','Description','Location','Purchased','Total cost','Status','Cost centre','Action'].map(x=><th key={x} className={`p-3 whitespace-nowrap ${x==='Total cost'?'text-right':'text-left'}`}>{t(x)}</th>)}</tr></thead><tbody>{visibleAssets.map(a=>{const status=computeYearSchedule(a,new Date().getFullYear(),settings).status;return <tr className="border-t border-border" key={a.id}><td className="p-3">{a.category}</td><td className="p-3">{a.asset_number||'–'}</td><td className="p-3 font-medium">{a.description}{totalCost(a)<settings.threshold&&<p className="text-destructive text-xs">{t('Low-value, expense directly')}</p>}</td><td className="p-3">{a.location||'–'}</td><td className="p-3 whitespace-nowrap">{dateLabel(a.purchase_date)}</td><td className="p-3 text-right font-mono">{money(totalCost(a),settings.reportingCurrency)}</td><td className="p-3 whitespace-nowrap">{t(status)}{a.disposal_date&&<p className="text-xs">{dateLabel(a.disposal_date)}</p>}</td><td className="p-3">{a.cost_centre}</td><td className="p-3"><div className="flex gap-1"><Button aria-label={t('Edit asset')} variant="ghost" size="icon" onClick={()=>{setEditing(a);setOpen(true);}}><Pencil className="size-4"/></Button><Button aria-label={t('Delete')} variant="ghost" size="icon" onClick={async()=>{if(confirm(settings.language==='DE'?`„${a.description}“ löschen?`:`Delete "${a.description}"?`)){await localAssets.remove(a.id);await qc.invalidateQueries({queryKey:ASSETS_QUERY_KEY,refetchType:'all'});}}}><Trash2 className="size-4 text-destructive"/></Button><AuditDialog assetId={a.id}/></div></td></tr>;})}</tbody></table></div>
  {assets.length>0&&visibleAssets.length===0&&!isLoading&&!invalidRange&&<p className="text-muted-foreground">{t('No matching assets')}</p>}
  {assets.length===0&&!isLoading&&<p className="text-muted-foreground">{t('No assets yet')}</p>}
  <AssetEditor open={open} onClose={()=>setOpen(false)} asset={editing} assets={assets}/></div>;
}

function ImportButton() {
  const t=useT();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedAsset[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [skipped, setSkipped] = useState(0);
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const res = parseAssetWorkbook(buf);
      setParsed(res.assets);
      setSkipped(res.skipped);
      setFileName(file.name);
      setOpen(true);
      if (res.assets.length === 0) {
        toast.error(t("No importable rows found in this file."));
      }
    } catch (e) {
      toast.error(t((e as Error).message));
    }
  };

  const doImport = async () => {
    if (parsed.length === 0) return;
    setBusy(true);
    try {
      const records = parsed.map((a) => ({
        asset_number: a.asset_number,
        category: a.category,
        description: a.description,
        location: a.location,
        purchase_date: a.purchase_date,
        purchase_price: a.purchase_price,
        rate_per_year: a.rate_per_year,
        disposal_date: null,
        notes: null,
      }));
      await localAssets.insert(records);
      await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success(`${t("Imported")} ${parsed.length} ${t("Assets")}`);
      setOpen(false);
      setParsed([]);
    } catch (e) {
      toast.error(t((e as Error).message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline" asChild>
        <label className="cursor-pointer">
          <Upload className="h-4 w-4 mr-2" /> {t("Import Excel")}
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) onFile(f);
            }}
          />
        </label>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("Import preview")} — {fileName}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {parsed.length} {t("asset(s) ready to import")}
            {skipped > 0 && ` · ${skipped} ${t("row(s) skipped (missing date / price / rate)")}`}
          </div>
          <div className="max-h-96 overflow-auto rounded border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-2">{t("Category")}</th>
                  <th className="text-left p-2">{t("Description")}</th>
                  <th className="text-left p-2">{t("Location")}</th>
                  <th className="text-left p-2">{t("Date")}</th>
                  <th className="text-right p-2">{t("Price")}</th>
                  <th className="text-right p-2">{t("Rate")}</th>
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 200).map((a, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 text-muted-foreground">{a.category}</td>
                    <td className="p-2">{a.description}</td>
                    <td className="p-2 text-muted-foreground">{a.location ?? "—"}</td>
                    <td className="p-2 font-mono">{dateLabel(a.purchase_date)}</td>
                    <td className="p-2 text-right font-mono">{a.purchase_price.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{(a.rate_per_year * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.length > 200 && (
              <div className="p-2 text-xs text-muted-foreground text-center">
                … {parsed.length - 200} {t("more")}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>{t("Cancel")}</Button>
            <Button onClick={doImport} disabled={busy || parsed.length === 0}>
              {busy ? t("Importing…") : `${t("Import")} ${parsed.length} ${t("Assets")}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BackupButton() {
  const t=useT(); const {refresh}=useSettings();
  const onClick = async () => {
    try {
      const json = await localAssets.exportJson(); await refresh();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gastronoassets-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t("Backup downloaded"));
    } catch (e) {
      toast.error(t((e as Error).message));
    }
  };
  return (
    <Button variant="outline" onClick={onClick}>
      <Download className="h-4 w-4 mr-2" /> {t("Backup")}
    </Button>
  );
}

function RestoreButton() {
  const t=useT(); const {refresh}=useSettings();
  const qc = useQueryClient();
  const onFile = async (file: File) => {
    try {
      const text = await file.text();
      const mode = confirm(
        t("OK = REPLACE all existing data with the backup\nCancel = MERGE backup into current data"),
      )
        ? "replace"
        : "merge";
      const n = await localAssets.importJson(text, mode); await refresh();
      await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success(`${t("Restored")} ${n} ${t("Assets")} (${t(mode)})`);
    } catch (e) {
      toast.error(t((e as Error).message));
    }
  };
  return (
    <Button variant="outline" asChild>
      <label className="cursor-pointer">
        <FolderUp className="h-4 w-4 mr-2" /> {t("Restore")}
        <input
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) onFile(f);
          }}
        />
      </label>
    </Button>
  );
}

