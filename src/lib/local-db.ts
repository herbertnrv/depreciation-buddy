// Local offline database for GastronoAssets.
// Uses IndexedDB (via Dexie) so the app runs fully offline with no server.
import Dexie, { type Table } from "dexie";
import type { AssetInput } from "./depreciation";

export type AssetRecord = AssetInput & {
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

class GastronoAssetsDB extends Dexie {
  fixed_assets!: Table<AssetRecord, string>;

  constructor() {
    super("gastrono_assets");
    this.version(1).stores({
      // primary key id, indexed by category and purchase_date for sorting
      fixed_assets: "id, category, purchase_date, asset_number, location",
    });
  }
}

// Lazy singleton — IndexedDB only exists in the browser.
let _db: GastronoAssetsDB | undefined;
function db(): GastronoAssetsDB {
  if (typeof window === "undefined") {
    throw new Error("Local DB is browser-only");
  }
  if (!_db) _db = new GastronoAssetsDB();
  return _db;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso(): string {
  return new Date().toISOString();
}

export type NewAsset = Omit<AssetRecord, "id" | "created_at" | "updated_at">;

export const localAssets = {
  async list(): Promise<AssetInput[]> {
    const rows = await db().fixed_assets.toArray();
    rows.sort((a, b) => {
      const c = a.category.localeCompare(b.category);
      if (c !== 0) return c;
      return a.purchase_date.localeCompare(b.purchase_date);
    });
    return rows;
  },

  async insert(items: NewAsset | NewAsset[]): Promise<void> {
    const arr = Array.isArray(items) ? items : [items];
    const ts = nowIso();
    const records: AssetRecord[] = arr.map((a) => ({
      ...a,
      id: uuid(),
      created_at: ts,
      updated_at: ts,
    }));
    await db().fixed_assets.bulkAdd(records);
  },

  async update(id: string, patch: Partial<NewAsset>): Promise<void> {
    await db().fixed_assets.update(id, { ...patch, updated_at: nowIso() });
  },

  async remove(id: string): Promise<void> {
    await db().fixed_assets.delete(id);
  },

  async clear(): Promise<void> {
    await db().fixed_assets.clear();
  },

  async exportJson(): Promise<string> {
    const rows = await db().fixed_assets.toArray();
    return JSON.stringify(
      { app: "GastronoAssets", version: 1, exported_at: nowIso(), fixed_assets: rows },
      null,
      2,
    );
  },

  async importJson(json: string, mode: "replace" | "merge" = "merge"): Promise<number> {
    const data = JSON.parse(json) as { fixed_assets?: AssetRecord[] };
    const rows = data.fixed_assets ?? [];
    if (mode === "replace") await db().fixed_assets.clear();
    const ts = nowIso();
    const recs = rows.map((r) => ({
      ...r,
      id: r.id || uuid(),
      created_at: r.created_at || ts,
      updated_at: ts,
    }));
    await db().fixed_assets.bulkPut(recs);
    return recs.length;
  },
};
