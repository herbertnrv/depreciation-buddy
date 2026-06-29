import { useQuery } from "@tanstack/react-query";
import { localAssets } from "./local-db";
import type { AssetInput } from "./depreciation";

export const ASSETS_QUERY_KEY = ["fixed_assets"] as const;

export async function fetchAssets(): Promise<AssetInput[]> {
  return localAssets.list();
}

export function useAssets() {
  return useQuery({
    queryKey: ASSETS_QUERY_KEY,
    queryFn: fetchAssets,
    // IndexedDB only exists in the browser; never run during SSR.
    enabled: typeof window !== "undefined",
  });
}
