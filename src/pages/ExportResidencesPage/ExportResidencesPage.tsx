import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePapaParse } from 'react-papaparse';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';

import { useGetResidences } from 'api/query/residenceQuery';
import { ExportIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { ExportProfilesWrapper } from './styles';

const COLUMN_TITLES = [
  '',
  'user.name',
  'user.project',
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.checkIn',
  'accommodation.checkOut',
  'accommodation.costNight',
  'accommodation.costMonth',
];

const COLUMNS: (keyof ResidenceTableRow)[] = [
  'user',
  'project',
  'owner',
  'adress',
  'checkInDate',
  'checkOutDate',
  'costNight',
  'costMonth',
];

type ResidenceTableRow = {
  _id: string;
  user: string;
  project: string;
  owner: string;
  adress: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  costNight: string;
  costMonth: string;
};

const ExportProfilesPage = () => {
  const { t } = useTranslation();

  const { data: residences = [] } = useGetResidences();
  const tableData: ResidenceTableRow[] = useMemo(() => residences.map((item) => {
    const { name, surname, project } = item.user as IUser;
    const { owner, adress, costNight, costMonth } = item.accommodation as IAccommodation;

    return {
      _id: item._id,
      user: `${name} ${surname}`,
      project: (project as IProject)?.name,
      owner,
      adress,
      checkInDate: getDateFromIso(item.checkInDate),
      checkOutDate: getDateFromIso(item.checkOutDate),
      costNight,
      costMonth,
    };
  }), [residences]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { jsonToCSV } = usePapaParse();
  const [colsToExport, setColsToExport] = useState<(keyof ResidenceTableRow)[]>([]);

  const selectItem = (tableRow: ResidenceTableRow, checked: boolean) => {
    setSelectedItems((prev) => {
      if (checked) {
        return [...prev, tableRow._id];
      }
      return prev.filter((item) => item !== tableRow._id);
    });
  };

  const exportData = (ext: 'csv' | 'xlsx' = 'csv') => {
    const dataToExport = tableData
      .filter((item) => selectedItems.includes(item._id))
      .map((item) => {
        const pickedItem = pick(item, colsToExport) as unknown as Record<keyof ResidenceTableRow, string | boolean>;
        const exportItem: Record<string, string | boolean> = {};
        COLUMNS.forEach((key, index) => {
          if (colsToExport.includes(key)) {
            exportItem[t(COLUMN_TITLES[index + 1])] = pickedItem[key] || '';
          }
        });
        return exportItem;
      });

    const prefix = ext === 'xlsx' ? 'data:application/vnd.ms-excel;charset=utf-8,' : 'data:text/csv;charset=utf-8,';
    const csvContent = `${prefix}${jsonToCSV(dataToExport)}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Parko_Accommodations_Export_${DateTime.now().toFormat('dd.MM.yyyy')}.${ext}`);
    document.body.appendChild(link);
    link.click();
  };

  const selectAll = useCallback(() => void setSelectedItems(residences.map((item) => item._id)), [residences]);

  const disableExport = !selectedItems.length || !colsToExport.length;

  return (
    <Page title={t('user.export')}>
      <PageTitle>{t('user.export')}</PageTitle>
      <ExportProfilesWrapper>
        <div className="fast-actions">
          <Checkbox
            title={t('selectAll')}
            checked={selectedItems.length === residences.length}
            onChange={(e) => {
              if (e.target.checked) {
                selectAll();
                return;
              }
              setSelectedItems([]);
            }}
          />
          <Checkbox
            title={t('selectAllCols')}
            checked={colsToExport.length === COLUMNS.length}
            onChange={(e) => {
              if (e.target.checked) {
                setColsToExport(COLUMNS);
                return;
              }
              setColsToExport([]);
            }}

          />
          <Button disabled={disableExport} onClick={() => void exportData()}><ExportIcon size={20}/>csv</Button>
          <Button disabled={disableExport} onClick={() => void exportData('xlsx')}><ExportIcon size={20}/>xlsx</Button>
        </div>
        <ListTable
          columns={COLUMN_TITLES}
          columnComponent={(colName, index) => {
            if (!colName) return null;
            const col = COLUMNS[index - 1];

            return (
              <Checkbox
                title={t(colName)}
                checked={colsToExport.includes(col)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setColsToExport((prev) => [...prev, col]);
                  } else {
                    setColsToExport((prev) => prev.filter((item) => item !== col));
                  }
                }}
              />
            );
          }}
          className="profiles-grid"
          stickyHeader
        >
          {tableData.map((item) => (
            <ListTableRow key={item._id}>
              <ListTableCell>
                <Checkbox
                  checked={selectedItems.includes(item._id)}
                  onChange={(e) => void selectItem(item, e.target.checked)}
                />
              </ListTableCell>
              {COLUMNS.map((field) => (
                <ListTableCell key={`${item._id}-${field}`}>{item[field] as string}</ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
      </ExportProfilesWrapper>
    </Page>
  );
};

export default ExportProfilesPage;
