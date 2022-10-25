import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePapaParse } from 'react-papaparse';
import { get, pick } from 'lodash-es';
import { DateTime } from 'luxon';

import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { ExportIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import { FiltersBar } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import Select from 'components/shared/Select';
import { IMPORTABLE_USER_FIELDS } from 'constants/userCsv';
import { STATUSES } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';

import { ExportProfilesWrapper } from './styles';

const ExportResidencesPage = () => {
  const { t } = useTranslation();

  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  const { data = [] } = useGetUserList();
  const users = useMemo(() => data.map((item) => {
    const newItem: AnyObject = { ...item };
    Object.keys(newItem).forEach((userKey) => {
      if (typeof newItem[userKey] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(newItem[userKey])) {
        newItem[userKey] = getDateFromIso(newItem[userKey]);
      }
    });
    return newItem as IUser;
  }), [data]);

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const { jsonToCSV } = usePapaParse();
  const [colsToExport, setColsToExport] = useState<(keyof IUser)[]>([]);

  const selectProfile = (profileId: string, checked: boolean) => {
    setSelectedProfiles((prev) => {
      if (checked) {
        return [...prev, profileId];
      }
      return prev.filter((item) => item !== profileId);
    });
  };

  const selectProfileByFilter = (key: string, value: unknown) => {
    setSelectedProfiles((prev) => {
      const selectedValues = data
        .filter((item) => get(item, key) === value)
        .map((item) => item._id);
      const allValues = new Set([...prev, ...selectedValues]);
      return Array.from(allValues);
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
        <FiltersBar>
          <Autocomplete
            label={t('search')}
            options={data}
            getOptionLabel={(row) => `${row.name} ${row.surname}`}
            onChange={(item) => { item && selectProfileByFilter('_id', item._id); }}
          />
          <Autocomplete
            label={t('user.project')}
            options={projects}
            getOptionLabel={(row) => row.name}
            onChange={(item) => { item && selectProfileByFilter('project._id', item._id); }}
          />
          <Select
            label={t('user.status')}
            options={translatedStatuses}
            onChange={(e) => { selectProfileByFilter('status', e.target.value); }}
          />
        </FiltersBar>
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
                  onChange={(e) => void selectProfile(user._id, e.target.checked)}
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
