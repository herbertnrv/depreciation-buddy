import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { MonthlyPage } from '@/components/register/monthly-page';
import { previousMonth } from '@/lib/monthly-voucher';
const schema=z.object({year:z.coerce.number().int().min(1900).max(9999).optional(),month:z.coerce.number().int().min(1).max(12).optional(),costCentre:z.string().optional()});
export const Route=createFileRoute('/_app/monthly')({
 validateSearch:schema,
 head:()=>({meta:[{title:'GastronoAssets | Monthly depreciation vouchers'},{name:'description',content:'Monthly depreciation posting vouchers, journal proposals and offline posting control.'},{property:'og:title',content:'GastronoAssets | Monthly depreciation vouchers'},{property:'og:description',content:'Printable accounting vouchers reconciled to the monthly asset schedule.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
 component:MonthlyRoute,
});
function MonthlyRoute(){const search=Route.useSearch(),navigate=Route.useNavigate(),fallback=previousMonth();return <MonthlyPage year={search.year??fallback.year} month={search.month??fallback.month} costCentre={search.costCentre||''} onPeriod={p=>void navigate({search:p})}/>;}
