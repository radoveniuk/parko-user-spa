import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePapaParse } from 'react-papaparse';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';

import { useGetUserList } from 'api/query/userQuery';
import { ExportIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import { IMPORTABLE_USER_FIELDS } from 'constants/userCsv';
import { IUser } from 'interfaces/users.interface';

import { ExportProfilesWrapper } from './styles';

const ExportResidencesPage = () => {
  const { t } = useTranslation();

  const { data: users = [] } = useGetUserList();

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const { jsonToCSV } = usePapaParse();
  const [colsToExport, setColsToExport] = useState<(keyof IUser)[]>([]);

  const selectProfile = (profile: IUser, checked: boolean) => {
    setSelectedProfiles((prev) => {
      if (checked) {
        return [...prev, profile._id];
      }
      return prev.filter((item) => item !== profile._id);
    });
  };

  const exportData = (ext: 'csv' | 'xlsx' = 'csv') => {
    const dataToExport = users
      .filter((item) => selectedProfiles.includes(item._id))
      .map((item) => {
        const pickedItem = pick(item, colsToExport) as unknown as Record<keyof IUser, string | boolean>;
        const exportItem: Record<string, string | boolean> = {};
        IMPORTABLE_USER_FIELDS.forEach((key) => {
          if (colsToExport.includes(key)) {
            exportItem[t(`user.${key}`)] = pickedItem[key] || '';
          }
        });
        return exportItem;
      });

    const prefix = ext === 'xlsx' ? 'data:application/vnd.ms-excel;charset=utf-8,' : 'data:text/csv;charset=utf-8,';
    const csvContent = `${prefix}${jsonToCSV(dataToExport)}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Parko_Users_Export_${DateTime.now().toFormat('dd.MM.yyyy')}.${ext}`);
    document.body.appendChild(link);
    link.click();
  };

  const selectAll = useCallback(() => void setSelectedProfiles(users.map((item) => item._id)), [users]);

  const disableExport = !selectedProfiles.length || !colsToExport.length;

  return (
    <Page title={t('user.export')}>
      <PageTitle>{t('user.export')}</PageTitle>
      <ExportProfilesWrapper>
        <div className="fast-actions">
          <Checkbox
            title={t('selectAll')}
            checked={selectedProfiles.length === users.length}
            onChange={(e) => {
              if (e.target.checked) {
                selectAll();
                return;
              }
              setSelectedProfiles([]);
            }}
          />
          <Checkbox
            title={t('selectAllCols')}
            checked={colsToExport.length === IMPORTABLE_USER_FIELDS.length}
            onChange={(e) => {
              if (e.target.checked) {
                setColsToExport(IMPORTABLE_USER_FIELDS);
                return;
              }
              setColsToExport([]);
            }}

          />
          <Button disabled={disableExport} onClick={() => void exportData()}><ExportIcon size={20}/>csv</Button>
          <Button disabled={disableExport} onClick={() => void exportData('xlsx')}><ExportIcon size={20}/>xlsx</Button>
        </div>
        <ListTable
          columns={['', ...IMPORTABLE_USER_FIELDS]}
          columnComponent={(col) => col && (
            <Checkbox
              title={t(`user.${col}`)}
              checked={colsToExport.includes(col as keyof IUser)}
              onChange={(e) => {
                if (e.target.checked) {
                  setColsToExport((prev) => [...prev, col as keyof IUser]);
                } else {
                  setColsToExport((prev) => prev.filter((item) => item !== col));
                }
              }}
            />
          )}
          className="profiles-grid"
          stickyHeader
        >
          {users.map((user) => (
            <ListTableRow key={user._id}>
              <ListTableCell>
                <Checkbox
                  checked={selectedProfiles.includes(user._id)}
                  onChange={(e) => void selectProfile(user, e.target.checked)}
                />
              </ListTableCell>
              {IMPORTABLE_USER_FIELDS.map((item) => (
                <ListTableCell key={`${user._id}-${item}`}>{user[item] as string}</ListTableCell>
              ))}
            </ListTableRow>
          ))}
        </ListTable>
      </ExportProfilesWrapper>
    </Page>
  );
};

export default ExportResidencesPage;
