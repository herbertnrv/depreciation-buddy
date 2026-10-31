export type Convention = 'full-month' | 'next-month' | 'mid-month' | 'daily';
export type Method = 'straight-line' | 'declining-balance' | 'none';
export type Disposal = { date: string; type: 'Sale' | 'Scrap' | 'Donation' | 'Loss/Theft'; fraction: number; proceeds: number; costs: number };
export type Impairment = { date: string; amount: number; reason: string; reversal?: boolean };
export type Transfer = { date: string; category: string; cost_centre: string };
export type Attachment = { name: string; type: string; data: string };
export type ExtendedAsset = {
  additional_costs?: number; residual_value?: number; in_service_date?: string;
  useful_life_months?: number; method?: Method; declining_factor?: number;
  currency?: string; exchange_rate?: number; supplier?: string; invoice_number?: string;
  cost_centre?: string; under_construction?: boolean; quantity?: number;
  attachments?: Attachment[]; disposals_history?: Disposal[]; impairments?: Impairment[];
  transfers?: Transfer[]; notes?: string | null;
};
export type AccountMap = { cost: string; accumulated: string; expense: string; gain: string; loss: string };
export type Settings = { language: 'EN' | 'DE'; reportingCurrency: string; convention: Convention;
  threshold: number; companyName: string; costCentres: string[]; categoryOrder: string[];
  accounts: Record<string, AccountMap>; lastManualBackup?: string };
export const DEFAULT_SETTINGS: Settings = { language: 'EN', reportingCurrency: 'LAK', convention: 'full-month', threshold: 0,
  companyName: 'GastronoAssets — Hotel & Gastro Service', costCentres: ['Hotel', 'Restaurant', 'Administration'], categoryOrder: [], accounts: {} };
export function precision(currency: string) { return currency === 'LAK' ? 0 : 2; }
export function roundMoney(value: number, currency: string) { const factor = 10 ** precision(currency); return Math.round((value + Number.EPSILON) * factor) / factor; }
export function money(value: number, currency = 'LAK') {
  const n = roundMoney(value, currency); if (!n) return '–';
  const s = new Intl.NumberFormat('en-US', { minimumFractionDigits: precision(currency), maximumFractionDigits: precision(currency) }).format(Math.abs(n));
  return n < 0 ? `(${s})` : s;
}
export function dateLabel(date: string) { return date ? date.slice(0, 10).split('-').reverse().join('.') : '–'; }
