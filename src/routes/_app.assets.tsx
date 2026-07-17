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

function validateForm(form: FormState): string[] {
  const errs: string[] = [];
  if (!form.category || !form.category.trim()) {
    errs.push("Category is required — pick an existing one or enter a new name.");
  }
  const price = Number(form.purchase_price);
  if (!form.purchase_price || isNaN(price) || price <= 0) {
    errs.push("Purchase price must be greater than 0. Enter a positive number (e.g. 1500).");
  }
  if (form.disposal_date) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const d = new Date(form.disposal_date);
    if (isNaN(d.getTime())) {
      errs.push("Disposal date is not a valid date.");
    } else if (d.getTime() > today.getTime()) {
      errs.push("Disposal date must be today or in the past — future dates are not allowed.");
    }
    if (form.purchase_date) {
      const p = new Date(form.purchase_date);
      if (!isNaN(p.getTime()) && d.getTime() < p.getTime()) {
        errs.push("Disposal date cannot be before the purchase date.");
      }
    }
  }
  return errs;
}

const LIFE_OPTIONS: { value: string; label: string; years: number | null }[] = [
  { value: "1", label: "1 year (100%)", years: 1 },
  { value: "2", label: "2 years (50%)", years: 2 },
  { value: "5", label: "5 years (20%)", years: 5 },
  { value: "10", label: "10 years (10%)", years: 10 },
  { value: "20", label: "20 years (5%)", years: 20 },
  { value: "forever", label: "No depreciation (e.g. Land)", years: null },
  { value: "custom", label: "Custom…", years: null },
];

const LAND_CATEGORIES = ["land", "grundstück", "grundstuck"];
const isLandCategory = (c: string) => LAND_CATEGORIES.includes(c.trim().toLowerCase());

function lifeFromRate(ratePct: number): string {
  if (ratePct === 0) return "forever";
  const years = Math.round(100 / ratePct);
  if ([1, 2, 5, 10, 20].includes(years) && Math.abs(100 / years - ratePct) < 0.01) {
    return String(years);
  }
  return "custom";
}

export const Route = createFileRoute("/_app/assets")({
  component: AssetsPage,
});

type FormState = {
  asset_number: string;
  category: string;
  description: string;
  location: string;
  purchase_date: string;
  purchase_price: string;
  useful_life: string; // "1" | "2" | "5" | "10" | "20" | "forever" | "custom"
  rate_per_year: string; // % e.g. "20"
  disposal_date: string;
  notes: string;
};

const blank: FormState = {
  asset_number: "",
  category: "Furniture",
  description: "",
  location: "",
  purchase_date: new Date().toISOString().slice(0, 10),
  purchase_price: "",
  useful_life: "5",
  rate_per_year: "20",
  disposal_date: "",
  notes: "",
};

function AssetsPage() {
  const { data: assets, isLoading } = useAssets();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AssetInput | null>(null);
  const [form, setForm] = useState<FormState>(blank);

  const errors = validateForm(form);

  const upsert = useMutation({
    mutationFn: async () => {
      const errs = validateForm(form);
      if (errs.length > 0) throw new Error(errs[0]);
      const payload = {
        asset_number: form.asset_number || null,
        category: form.category.trim(),
        description: form.description.trim(),
        location: form.location || null,
        purchase_date: form.purchase_date,
        purchase_price: Number(form.purchase_price),
        rate_per_year: Number(form.rate_per_year) / 100,
        disposal_date: form.disposal_date || null,
        notes: form.notes || null,
      };
      if (editing) {
        await localAssets.update(editing.id, payload);
        return { id: editing.id, ...payload };
      }
      const id = await localAssets.insert(payload);
      return { id, ...payload };
    },
    onSuccess: async (saved) => {
      // Force a full refetch so the depreciation schedule recomputes
      // immediately for the newly added / edited asset, even on tabs
      // that are not currently mounted.
      await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY, refetchType: "all" });
      await qc.refetchQueries({ queryKey: ASSETS_QUERY_KEY });
      const months = Math.round(12 / Math.max(saved.rate_per_year || 0, 0.0001));
      const monthly = (saved.purchase_price * saved.rate_per_year) / 12;
      toast.success(
        editing
          ? "Asset updated — depreciation recalculated"
          : saved.rate_per_year > 0
            ? `Asset added — monthly depreciation ${monthly.toFixed(2)} over ${months} months`
            : "Asset added — no depreciation (rate 0%)",
      );
      setOpen(false);
      setEditing(null);
      setForm(blank);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await localAssets.remove(id);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY, refetchType: "all" });
      await qc.refetchQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Asset removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = (a: AssetInput) => {
    setEditing(a);
    const ratePct = Math.round(a.rate_per_year * 1000) / 10;
    setForm({
      asset_number: a.asset_number ?? "",
      category: a.category,
      description: a.description,
      location: a.location ?? "",
      purchase_date: a.purchase_date,
      purchase_price: String(a.purchase_price),
      useful_life: lifeFromRate(ratePct),
      rate_per_year: String(ratePct),
      disposal_date: a.disposal_date ?? "",
      notes: "",
    });
    setOpen(true);
  };

  const applyCategory = (v: string) => {
    if (isLandCategory(v)) {
      setForm({ ...form, category: v, useful_life: "forever", rate_per_year: "0" });
    } else {
      setForm({ ...form, category: v });
    }
  };

  const applyLife = (v: string) => {
    const opt = LIFE_OPTIONS.find((o) => o.value === v);
    if (!opt) return;
    if (v === "forever") setForm({ ...form, useful_life: v, rate_per_year: "0" });
    else if (v === "custom") setForm({ ...form, useful_life: v });
    else if (opt.years) setForm({ ...form, useful_life: v, rate_per_year: String(100 / opt.years) });
  };

  const startNew = () => {
    setEditing(null);
    setForm(blank);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Assets</h2>
          <p className="text-sm text-muted-foreground">
            Master data — changes flow into every year's schedule automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <BackupButton />
          <RestoreButton />
          <ImportButton />
          <DisposeButton assets={assets ?? []} />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={startNew}>
                <Plus className="h-4 w-4 mr-2" /> Add asset
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit asset" : "New asset"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <CategoryField
                value={form.category}
                onChange={applyCategory}
                existing={Array.from(new Set((assets ?? []).map((a) => a.category).filter(Boolean))).sort((a, b) => a.localeCompare(b))}
              />
              <Field label="Asset number" value={form.asset_number} onChange={(v) => setForm({ ...form, asset_number: v })} />
              <div className="col-span-2">
                <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
              </div>
              <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
              <Field label="Purchase date" type="date" value={form.purchase_date} onChange={(v) => setForm({ ...form, purchase_date: v })} />
              <Field label="Purchase price" type="number" value={form.purchase_price} onChange={(v) => setForm({ ...form, purchase_price: v })} />
              <div>
                <Label className="mb-2 block">Useful life</Label>
                <Select value={form.useful_life} onValueChange={applyLife}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LIFE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field
                label={
                  form.useful_life === "custom"
                    ? "Rate per year (%)"
                    : "Rate per year (%) — auto"
                }
                type="number"
                value={form.rate_per_year}
                onChange={(v) => setForm({ ...form, rate_per_year: v, useful_life: "custom" })}
              />
              <Field label="Disposal date (optional)" type="date" max={new Date().toISOString().slice(0, 10)} value={form.disposal_date} onChange={(v) => setForm({ ...form, disposal_date: v })} />
              <div className="col-span-2">
                <Label className="mb-2 block">Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            {errors.length > 0 && (form.purchase_price !== "" || form.disposal_date !== "") && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please fix the following before saving</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => upsert.mutate()} disabled={upsert.isPending || !form.description || errors.length > 0}>
                {editing ? "Save changes" : "Add asset"}
              </Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}

      {assets && assets.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No assets yet. Add your first one to get started.</p>
        </div>
      )}

      {assets && assets.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs">
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Asset #</th>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Purchased</th>
                <th className="text-right p-3 font-medium">Price</th>
                <th className="text-right p-3 font-medium">Rate</th>
                <th className="text-left p-3 font-medium">Disposed</th>
                <th className="text-right p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground">{a.category}</td>
                  <td className="p-3 font-mono text-xs">{a.asset_number ?? "—"}</td>
                  <td className="p-3 font-medium text-foreground">{a.description}</td>
                  <td className="p-3 text-muted-foreground">{a.location ?? "—"}</td>
                  <td className="p-3 font-mono text-xs">{a.purchase_date}</td>
                  <td className="p-3 text-right font-mono">{formatMoney(a.purchase_price)}</td>
                  <td className="p-3 text-right font-mono">{(a.rate_per_year * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-xs">{a.disposal_date ?? "—"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(a)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(`Delete "${a.description}"? This cannot be undone.`)) {
                            remove.mutate(a.id);
                          }
                        }}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  max?: string;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <Input type={type} value={value} max={max} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function CategoryField({
  value,
  onChange,
  existing,
}: {
  value: string;
  onChange: (v: string) => void;
  existing: string[];
}) {
  const NEW = "__new__";
  const isExisting = existing.includes(value);
  const [mode, setMode] = useState<"select" | "new">(
    existing.length === 0 || (!isExisting && value !== "") ? "new" : "select"
  );

  return (
    <div>
      <Label className="mb-2 block">Category</Label>
      {mode === "select" && existing.length > 0 ? (
        <Select
          value={isExisting ? value : ""}
          onValueChange={(v) => {
            if (v === NEW) {
              setMode("new");
              onChange("");
            } else {
              onChange(v);
            }
          }}
        >
          <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
          <SelectContent>
            {existing.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
            <SelectItem value={NEW}>+ New category…</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            value={value}
            placeholder="New category name"
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
          {existing.length > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={() => setMode("select")}>
              ↩
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function ImportButton() {
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
        toast.error("No importable rows found in this file.");
      }
    } catch (e) {
      toast.error((e as Error).message);
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
      toast.success(`Imported ${parsed.length} assets`);
      setOpen(false);
      setParsed([]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline" asChild>
        <label className="cursor-pointer">
          <Upload className="h-4 w-4 mr-2" /> Import Excel
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
            <DialogTitle>Import preview — {fileName}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {parsed.length} asset(s) ready to import
            {skipped > 0 && ` · ${skipped} row(s) skipped (missing date / price / rate)`}
          </div>
          <div className="max-h-96 overflow-auto rounded border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 200).map((a, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 text-muted-foreground">{a.category}</td>
                    <td className="p-2">{a.description}</td>
                    <td className="p-2 text-muted-foreground">{a.location ?? "—"}</td>
                    <td className="p-2 font-mono">{a.purchase_date}</td>
                    <td className="p-2 text-right font-mono">{a.purchase_price.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{(a.rate_per_year * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.length > 200 && (
              <div className="p-2 text-xs text-muted-foreground text-center">
                …and {parsed.length - 200} more
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button onClick={doImport} disabled={busy || parsed.length === 0}>
              {busy ? "Importing…" : `Import ${parsed.length} assets`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BackupButton() {
  const onClick = async () => {
    try {
      const json = await localAssets.exportJson();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gastronoassets-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <Button variant="outline" onClick={onClick}>
      <Download className="h-4 w-4 mr-2" /> Backup
    </Button>
  );
}

function RestoreButton() {
  const qc = useQueryClient();
  const onFile = async (file: File) => {
    try {
      const text = await file.text();
      const mode = confirm(
        "OK = REPLACE all existing data with the backup\nCancel = MERGE backup into current data",
      )
        ? "replace"
        : "merge";
      const n = await localAssets.importJson(text, mode);
      await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success(`Restored ${n} assets (${mode})`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <Button variant="outline" asChild>
      <label className="cursor-pointer">
        <FolderUp className="h-4 w-4 mr-2" /> Restore
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

const DISPOSED_CATEGORY = "Disposed assets";

function computeDisposalValues(asset: AssetInput, disposalDate: string) {
  const [dy, dm] = disposalDate.split("-").map(Number);
  const year = dy;
  const sched = computeYearSchedule(asset, year);
  // Depreciation Jan..(disposal month - 1) inclusive of the year
  const monthsThisYear = Math.max(0, dm - 1);
  const yearDeprToDate = sched.months.slice(0, monthsThisYear).reduce((s, v) => s + v, 0);
  const bookValueAtStartOfYear = sched.openingNBV;
  const bookValueAtDisposal = Math.max(0, bookValueAtStartOfYear - yearDeprToDate);
  return { year, bookValueAtStartOfYear, yearDeprToDate, bookValueAtDisposal };
}

function DisposeButton({ assets }: { assets: AssetInput[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [assetId, setAssetId] = useState("");
  const [disposalDate, setDisposalDate] = useState(new Date().toISOString().slice(0, 10));
  const [proceeds, setProceeds] = useState("");
  const [busy, setBusy] = useState(false);

  const active = assets.filter((a) => !a.disposal_date && a.category !== DISPOSED_CATEGORY);
  const categories = Array.from(new Set(active.map((a) => a.category))).sort((a, b) => a.localeCompare(b));
  const inCategory = active.filter((a) => a.category === category);
  const selected = active.find((a) => a.id === assetId) ?? null;

  const today = new Date().toISOString().slice(0, 10);
  const errors: string[] = [];
  if (selected && disposalDate) {
    if (disposalDate > today) errors.push("Disposal date must be today or in the past.");
    if (disposalDate < selected.purchase_date) errors.push("Disposal date cannot be before the purchase date.");
  }

  const calc = selected && disposalDate && errors.length === 0
    ? computeDisposalValues(selected, disposalDate)
    : null;

  const proceedsNum = Number(proceeds) || 0;
  const bookValuePortion = calc ? Math.min(proceedsNum, calc.bookValueAtDisposal) : 0;
  const extraordinaryGain = calc ? proceedsNum - calc.bookValueAtDisposal : 0;

  const reset = () => {
    setCategory(""); setAssetId(""); setProceeds("");
    setDisposalDate(new Date().toISOString().slice(0, 10));
  };

  const confirm = async () => {
    if (!selected || !calc) return;
    setBusy(true);
    try {
      const note = [
        `Disposed on ${disposalDate}.`,
        `Original category: ${selected.category}.`,
        `Book value at 01.01.${calc.year}: ${calc.bookValueAtStartOfYear.toFixed(2)}.`,
        `Depreciation ${calc.year} up to disposal: ${calc.yearDeprToDate.toFixed(2)}.`,
        `Book value at disposal: ${calc.bookValueAtDisposal.toFixed(2)}.`,
        `Proceeds: ${proceedsNum.toFixed(2)} (book value portion ${bookValuePortion.toFixed(2)}, extraordinary ${extraordinaryGain >= 0 ? "gain" : "loss"} ${extraordinaryGain.toFixed(2)}).`,
      ].join(" ");
      await localAssets.update(selected.id, {
        category: DISPOSED_CATEGORY,
        disposal_date: disposalDate,
        notes: note,
      });
      await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY, refetchType: "all" });
      await qc.refetchQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success(
        `Asset disposed — book value ${bookValuePortion.toFixed(2)}, extraordinary ${extraordinaryGain >= 0 ? "gain" : "loss"} ${Math.abs(extraordinaryGain).toFixed(2)}`,
      );
      setOpen(false);
      reset();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PackageMinus className="h-4 w-4 mr-2" /> Dispose asset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Dispose asset</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">1. Category</Label>
            <Select value={category} onValueChange={(v) => { setCategory(v); setAssetId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
              <SelectContent>
                {categories.length === 0 && <SelectItem value="__none" disabled>No assets available</SelectItem>}
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">2. Asset</Label>
            <Select value={assetId} onValueChange={setAssetId} disabled={!category}>
              <SelectTrigger><SelectValue placeholder={category ? "Select asset…" : "Pick a category first"} /></SelectTrigger>
              <SelectContent>
                {inCategory.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {(a.asset_number ? `[${a.asset_number}] ` : "")}{a.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">3. Disposal date</Label>
            <Input
              type="date"
              value={disposalDate}
              max={today}
              min={selected?.purchase_date}
              onChange={(e) => setDisposalDate(e.target.value)}
              disabled={!selected}
            />
          </div>

          {calc && (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm space-y-1 font-mono">
              <div className="flex justify-between"><span>Book value at 01.01.{calc.year}</span><span>{formatMoney(calc.bookValueAtStartOfYear)}</span></div>
              <div className="flex justify-between"><span>Depreciation {calc.year} (Jan–month before disposal)</span><span>−{formatMoney(calc.yearDeprToDate)}</span></div>
              <div className="flex justify-between font-semibold border-t border-border pt-1"><span>Book value at disposal</span><span>{formatMoney(calc.bookValueAtDisposal)}</span></div>
            </div>
          )}

          <div>
            <Label className="mb-2 block">4. Proceeds (sale price)</Label>
            <Input
              type="number"
              value={proceeds}
              onChange={(e) => setProceeds(e.target.value)}
              disabled={!calc}
              placeholder="0.00"
            />
          </div>

          {calc && proceeds !== "" && (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm space-y-1 font-mono">
              <div className="flex justify-between"><span>Proceeds</span><span>{formatMoney(proceedsNum)}</span></div>
              <div className="flex justify-between"><span>→ Book value portion</span><span>{formatMoney(bookValuePortion)}</span></div>
              <div className="flex justify-between">
                <span>→ Extraordinary {extraordinaryGain >= 0 ? "gain" : "loss"}</span>
                <span className={extraordinaryGain >= 0 ? "text-emerald-600" : "text-destructive"}>
                  {formatMoney(Math.abs(extraordinaryGain))}
                </span>
              </div>
              <div className="text-xs text-muted-foreground pt-2 font-sans">
                After confirmation the asset stays in inventory under category
                <span className="font-semibold"> “{DISPOSED_CATEGORY}” </span>
                with a closing book value of 0.
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fix the following</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button
            onClick={confirm}
            disabled={busy || !selected || !calc || proceeds === "" || errors.length > 0}
          >
            {busy ? "Saving…" : "Confirm disposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
