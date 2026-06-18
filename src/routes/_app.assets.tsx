import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ASSETS_QUERY_KEY, useAssets } from "@/lib/use-assets";
import type { AssetInput } from "@/lib/depreciation";
import { formatMoney } from "@/lib/depreciation";
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
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { parseAssetWorkbook, type ParsedAsset } from "@/lib/import-xlsx";
import { toast } from "sonner";

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

  const upsert = useMutation({
    mutationFn: async () => {
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
        const { error } = await supabase.from("fixed_assets").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fixed_assets").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success(editing ? "Asset updated" : "Asset added");
      setOpen(false);
      setEditing(null);
      setForm(blank);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fixed_assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
      toast.success("Asset removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = (a: AssetInput) => {
    setEditing(a);
    setForm({
      asset_number: a.asset_number ?? "",
      category: a.category,
      description: a.description,
      location: a.location ?? "",
      purchase_date: a.purchase_date,
      purchase_price: String(a.purchase_price),
      rate_per_year: String(Math.round(a.rate_per_year * 1000) / 10),
      disposal_date: a.disposal_date ?? "",
      notes: "",
    });
    setOpen(true);
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
          <ImportButton />
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
              <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              <Field label="Asset number" value={form.asset_number} onChange={(v) => setForm({ ...form, asset_number: v })} />
              <div className="col-span-2">
                <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
              </div>
              <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
              <Field label="Purchase date" type="date" value={form.purchase_date} onChange={(v) => setForm({ ...form, purchase_date: v })} />
              <Field label="Purchase price" type="number" value={form.purchase_price} onChange={(v) => setForm({ ...form, purchase_price: v })} />
              <Field label="Rate per year (%)" type="number" value={form.rate_per_year} onChange={(v) => setForm({ ...form, rate_per_year: v })} />
              <Field label="Disposal date (optional)" type="date" value={form.disposal_date} onChange={(v) => setForm({ ...form, disposal_date: v })} />
              <div className="col-span-2">
                <Label className="mb-2 block">Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => upsert.mutate()} disabled={upsert.isPending || !form.description || !form.purchase_price}>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
