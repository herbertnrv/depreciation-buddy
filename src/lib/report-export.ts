import * as XLSX from 'xlsx';
import { type AssetInput } from './depreciation';
import { type Settings } from './asset-model';
import { translate } from './i18n';
export function exportAllExcel(assets:AssetInput[],settings:Settings){const wb=XLSX.utils.book_new();const rows=assets.map(a=>({...a,attachments:JSON.stringify(a.attachments),disposals_history:JSON.stringify(a.disposals_history),impairments:JSON.stringify(a.impairments),transfers:JSON.stringify(a.transfers)}));XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),translate('Assets',settings.language));XLSX.writeFile(wb,'gastronoassets-all-data.xlsx');}
