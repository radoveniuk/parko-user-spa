import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash-es';

import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { ExportIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Checkbox from 'components/shared/Checkbox';
import { FiltersBar } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { MenuItem } from 'components/shared/Menu';
import Page, { PageTitle } from 'components/shared/Page';
import Select from 'components/shared/Select';
import { DYNAMIC_FIELDS, IMPORTABLE_USER_FIELDS, TRANSLATED_FIELDS } from 'constants/userCsv';
import { STATUSES } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
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
      if (TRANSLATED_FIELDS.includes(userKey as keyof IUser)) {
        if (typeof newItem[userKey] === 'boolean') {
          newItem[userKey] = t(newItem[userKey]);
        } else if (newItem[userKey]) {
          if (userKey === 'role') {
            newItem[userKey] = t(`selects.userRole.${newItem[userKey]}`);
          }
          if (userKey === 'status') {
            newItem[userKey] = t(`selects.userStatus.${newItem[userKey]}`);
          }
          if (userKey === 'permitType') {
            newItem[userKey] = t(`selects.permitType.${newItem[userKey]}`);
          }
          if (userKey === 'sex') {
            newItem[userKey] = t(newItem[userKey]);
          }
        }
      }
      if (DYNAMIC_FIELDS.includes(userKey as keyof IUser)) {
        if (userKey === 'project') {
          newItem[userKey] = newItem[userKey]?.name;
        }
      }
    });
    return newItem as IUser;
  }), [data, t]);

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [colsToExport, setColsToExport] = useState<(keyof IUser)[]>([]);
  const exportData = useExportData({
    data: users.filter((item) => selectedProfiles.includes(item._id)),
    colsToExport,
    cols: IMPORTABLE_USER_FIELDS,
    entity: 'user',
  });

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
