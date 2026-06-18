import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AssetInput } from "./depreciation";

export const ASSETS_QUERY_KEY = ["fixed_assets"] as const;

export async function fetchAssets(): Promise<AssetInput[]> {
  const { data, error } = await supabase
    .from("fixed_assets")
    .select(
      "id, asset_number, category, description, location, purchase_date, purchase_price, rate_per_year, disposal_date",
    )
    .order("category", { ascending: true })
    .order("purchase_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AssetInput[];
}

export function useAssets() {
  return useQuery({ queryKey: ASSETS_QUERY_KEY, queryFn: fetchAssets });
}
