import { it,expect } from 'vitest';
import { computeYearSchedule,type AssetInput } from './depreciation';
import { reportRows,checkDifference } from './report-model';
import { summaryWorkbook,defaultReportOptions } from './report-export';
import { DEFAULT_SETTINGS } from './asset-model';
const asset:AssetInput={id:'a',asset_number:'A-1',category:'Equipment',description:'Test',purchase_date:'2026-03-15',purchase_price:100000000,rate_per_year:.2,disposal_date:null,location:null};
const a=computeYearSchedule(asset,2026),b=computeYearSchedule({...asset,id:'b',disposals_history:[{date:'2026-07-15',fraction:1,type:'Sale',proceeds:95000000,costs:0}]},2026);
it('every asset, category and total reconciles',()=>{const rows=reportRows([['Equipment',[a,b]]],new Set(['Equipment']));expect(rows).toHaveLength(4);for(const r of rows){expect(checkDifference(r)).toBeCloseTo(0);expect(r.cost-r.accumulated).toBeCloseTo(r.nbvClose);}expect(rows[0].nbvClose).toBe(a.closingNBV+b.closingNBV);expect(rows[3].nbvClose).toBe(rows[0].nbvClose);});
it('Excel includes Summary and Assets with real subtotal and check formulas',()=>{const wb=summaryWorkbook([['Equipment',[a,b]]],2026,DEFAULT_SETTINGS,defaultReportOptions());expect(wb.SheetNames).toEqual(['Summary','Assets']);expect(wb.Sheets.Summary.B6.f).toBe('Assets!F2+Assets!F3');expect(wb.Sheets.Summary.H6.f).toBe('C6+D6-E6-F6-G6');});
