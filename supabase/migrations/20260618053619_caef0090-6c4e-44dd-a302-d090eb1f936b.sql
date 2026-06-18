
CREATE TABLE public.fixed_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_number TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  purchase_date DATE NOT NULL,
  purchase_price NUMERIC(18,2) NOT NULL CHECK (purchase_price >= 0),
  rate_per_year NUMERIC(6,4) NOT NULL CHECK (rate_per_year > 0 AND rate_per_year <= 1),
  disposal_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fixed_assets TO anon, authenticated;
GRANT ALL ON public.fixed_assets TO service_role;

ALTER TABLE public.fixed_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read fixed assets"
  ON public.fixed_assets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert fixed assets"
  ON public.fixed_assets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update fixed assets"
  ON public.fixed_assets FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Public can delete fixed assets"
  ON public.fixed_assets FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_fixed_assets_updated_at
  BEFORE UPDATE ON public.fixed_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_fixed_assets_category ON public.fixed_assets(category);
CREATE INDEX idx_fixed_assets_purchase_date ON public.fixed_assets(purchase_date);
