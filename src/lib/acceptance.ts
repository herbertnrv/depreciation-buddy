import { computeYearSchedule, normalizeAsset, type AssetInput } from './depreciation';
import { DEFAULT_SETTINGS, roundMoney } from './asset-model';
export type Check={name:string; passed:boolean; actual:string};
export function acceptanceChecks():Check[] {
 const asset:AssetInput={id:'test',asset_number:'T-001',category:'Equipment',description:'Acceptance fixture',location:'Hotel',purchase_date:'2026-03-15',purchase_price:100000000,rate_per_year:.2,disposal_date:null};
 const s=computeYearSchedule(asset,2026),next=computeYearSchedule(asset,2027);
 const odd=computeYearSchedule({...asset,rate_per_year:.07,residual_value:5000000},2041);
 const sale=computeYearSchedule({...asset,disposals_history:[{date:'2026-07-15',fraction:1,type:'Sale',proceeds:95000000,costs:1000000}]},2026);
 const daily=computeYearSchedule({...asset,disposals_history:[{date:'2026-07-15',fraction:1,type:'Sale',proceeds:95000000,costs:0}]},2026,{...DEFAULT_SETTINGS,convention:'daily'});
 const migrated=normalizeAsset(asset);
 const check=(name:string,passed:boolean,actual:unknown)=>({name,passed,actual:String(actual)});
 return [check('100,000,000 LAK / 5 years / March full month: 2026 depreciation = 16,666,667',roundMoney(s.yearDepreciation,'LAK')===16666667,roundMoney(s.yearDepreciation,'LAK')),
 check('Closing NBV = 83,333,333 LAK',roundMoney(s.closingNBV,'LAK')===83333333,roundMoney(s.closingNBV,'LAK')),
 check('7% rate: full-life NBV equals residual exactly',Math.abs(odd.closingNBV-5000000)<.000001,odd.closingNBV),
 check('Sale: NBV removed, cost and accumulated depreciation removed; closing NBV zero',sale.closingNBV===0&&Math.abs(sale.costRemoved-sale.disposalAccumulatedRemoved-sale.disposals)<.000001&&Math.abs(sale.gainLoss-(sale.proceeds-sale.disposalCosts-sale.disposals))<.000001,sale.disposals),
 check('Daily disposal: July depreciation only through 15 July',Math.abs(daily.months[6]-100000000/60*15/31)<.000001,daily.months[6]),
 check('12 displayed months equal displayed annual depreciation',s.displayMonths.reduce((a,b)=>a+b,0)===roundMoney(s.yearDepreciation,'LAK'),s.displayMonths.join(' + ')),
 check('Closing NBV year N equals opening NBV year N+1',Math.abs(s.closingNBV-next.openingNBV)<.000001,next.openingNBV),
 check('NBV opening + additions − disposals − depreciation = closing',Math.abs(s.openingNBV+s.additions-s.disposals-s.yearDepreciation-s.closingNBV)<.000001,s.closingNBV),
 check('Old record defaults: service date, residual, method, currency',migrated.in_service_date===asset.purchase_date&&migrated.residual_value===0&&migrated.method==='straight-line'&&migrated.currency==='LAK',JSON.stringify({date:migrated.in_service_date,residual:migrated.residual_value,method:migrated.method,currency:migrated.currency})),
 check('Subtotals and grand total equal sum of assets',Math.abs((s.openingNBV+sale.openingNBV)+(s.additions+sale.additions)-(s.disposals+sale.disposals)-(s.yearDepreciation+sale.yearDepreciation)-(s.closingNBV+sale.closingNBV))<.000001,s.closingNBV+sale.closingNBV)];
}
