import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetResidences } from 'api/query/residenceQuery';
import { ExportIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { MenuItem } from 'components/shared/Menu';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
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
  const [colsToExport, setColsToExport] = useState<(keyof ResidenceTableRow)[]>([]);

  const exportData = useExportData({
    data: tableData.filter((item) => selectedItems.includes(item._id)),
    colsToExport,
    cols: COLUMNS,
    colsTitles: COLUMN_TITLES.filter((item) => !!item),
  });

  const selectItem = (tableRow: ResidenceTableRow, checked: boolean) => {
    setSelectedItems((prev) => {
      if (checked) {
        return [...prev, tableRow._id];
      }
      return prev.filter((item) => item !== tableRow._id);
    });
  };

  const selectAll = useCallback(() => void setSelectedItems(residences.map((item) => item._id)), [residences]);

  const disableExport = !selectedItems.length || !colsToExport.length;

  useDocumentTitle(t('user.export'));

  return (
    <>
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
          <Menu disabled={disableExport} title={<><ExportIcon size={20}/>{t('download')}</>}>
            <MenuItem
              onClick={() => {
                exportData();
              }}
              style={{ width: 150 }}
            >
              CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportData('xlsx');
              }}
              style={{ width: 150 }}
            >XLSX</MenuItem>
          </Menu>
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
    </>
  );
};

export default ExportProfilesPage;
