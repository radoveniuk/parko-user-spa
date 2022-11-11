import { useTranslation } from 'react-i18next';
import { usePapaParse } from 'react-papaparse';
import xlsx from 'json-as-xlsx';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';

import { AnyObject } from 'interfaces/base.types';

type Args = {
  data: AnyObject[],
  colsToExport: string[],
  cols: string[],
  colsTitles?: string[],
  entity?: string,
};

export const useExportData = ({ data, colsToExport, cols, colsTitles, entity }: Args) => {
  const { t } = useTranslation();
  const { jsonToCSV } = usePapaParse();

  const exportData = (ext: 'csv' | 'xlsx' = 'csv') => {
    const fileName = `Parko_Export_${DateTime.now().toFormat('dd.MM.yyyy')}`;
    if (ext === 'csv') {
      const dataToExport = data
        .map((item) => {
          const pickedItem = pick(item, colsToExport);
          const exportItem: Record<string, string | boolean> = {};
          cols.forEach((key, index) => {
            if (colsToExport.includes(key)) {
              exportItem[colsTitles ? t(colsTitles[index]) : t(`${entity}.${key}`).replace(`${entity}.`, '')] = pickedItem[key] || '';
            }
          });
          return exportItem;
        });
      const csvContent = `data:text/csv;charset=utf-8,${jsonToCSV(dataToExport)}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
    }
    if (ext === 'xlsx') {
      const dataToExport = [
        {
          sheet: 'Results',
          columns: [
            ...colsToExport.map((col, index) => ({
              label: colsTitles ? t(colsTitles[index]) : t(`${entity}.${col}`).replace(`${entity}.`, ''),
              value: col,
            })),
          ],
          content: data,
        },
      ];
      const settings = {
        fileName,
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(dataToExport, settings);
    }
  };
  return exportData;
};
