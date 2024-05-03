import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrintDocDialog from 'v2/components/PrintDocDialog';
import { COUNTRIES } from 'v2/constants/countries';
import { PROJECT_TYPES } from 'v2/constants/projectType';
import { USER_WORK_TYPES } from 'v2/constants/userWorkTypes';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetClients } from 'api/query/clientQuery';
import { useGetCustomFormFieldSectionBindings } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { getUserListByParams, useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { ClearFiltersButton, FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import { isMongoId } from 'helpers/regex';
import useLocalStorageState from 'hooks/useLocalStorageState';
import usePageQueries from 'hooks/usePageQueries';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IRole } from 'interfaces/role.interface';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import FilterBarVisibilityProvider, { useFilterBarVisibility } from './contexts/FilterBarVisibilityContext';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = ['user.email'];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('profileList'));
  const pageQueries = usePageQueries();

  const { debouncedFiltersState, filtersState, removeFilter } = useFilters();

  // table content
  const { data = [], refetch, remove, isFetching, isLoading } = useGetUserList(debouncedFiltersState, { enabled: false });

  const [startData, setStartData] = useState<IUser[]>([]);
  const [isFetchingStartData, setIsFetchingStartData] = useState(false);
  useEffect(() => {
    setIsFetchingStartData(true);
    getUserListByParams({ take: 20, skip: 0, ...pageQueries }).then((res: IUser[]) => {
      setStartData(res);
      setIsFetchingStartData(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filters
  const { data: usersFilter = [] } = useGetUserListForFilter();
  const { data: recruiters = [] } = useGetUserList({ permissions: 'users:update' });
  const { data: clients = [] } = useGetClients();
  const { data: projects = [] } = useGetProjects({ clients: debouncedFiltersState?.clients });
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const translatedWorkTypes = useTranslatedSelect(USER_WORK_TYPES, 'userWorkType');
  const translatedSexes = useTranslatedSelect(['male', 'female']);

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
  }, [debouncedFiltersState, refetch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => { remove(); }, []);

  useEffect(() => {
    if (data.length) {
      setStartData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]);

  // Toggle table heigth for better ux
  const [filterBarVisibility] = useFilterBarVisibility();

  // Custom fields
  const { data: allCustomFieldSectionBindings = [] } = useGetCustomFormFieldSectionBindings();
  const userBindings = useMemo(() =>
    allCustomFieldSectionBindings.filter(binding => binding?.section?.entity === 'user'),
  [allCustomFieldSectionBindings]);

  // Columns Settings
  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('profilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);

  useEffect(() => {
    if (allCustomFieldSectionBindings.length) {
      setActiveCols((prev) => prev.filter((col) => {
        if (isMongoId(col) && !allCustomFieldSectionBindings.some(binding => binding._id === col)) {
          return false;
        }
        return true;
      }));
    }
  }, [allCustomFieldSectionBindings]);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: activeCols }));
  }, [activeCols, setStoredColsSettings]);

  // reset projects filter after reseting client
  useEffect(() => {
    if (!filtersState?.clients?.length) {
      removeFilter('projects');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersState?.clients]);

  const loading = isLoading || isFetching || isFetchingStartData;

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setOpenPrintDialog={setOpenPrintDialog}
          data={!data.length ? startData : data}
          activeCols={activeCols}
          customFields={userBindings}
          loading={loading}
        />
        <FilterTableWrapper className={!filterBarVisibility ? 'hide' : ''}>
          <FilterAutocomplete
            multiple
            options={usersFilter}
            labelKey="fullname"
            filterKey="ids"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            label={t('search')}
            placeholder={t('search')}
            disabled={loading}
          />
          <FilterAutocomplete
            multiple
            filterKey="statuses"
            label={t('user.status')}
            options={translatedStatuses}
            labelKey="label"
            theme="gray"
            disabled={loading}
          />
          <FilterAutocomplete
            multiple
            filterKey="clients"
            label={t('project.client')}
            options={clients}
            getOptionLabel={(option: IClient) => option.shortName || option.name}
            theme="gray"
            disabled={loading}
          />
          <FilterAutocomplete
            disabled={!debouncedFiltersState?.clients || loading}
            multiple
            filterKey="projects"
            label={t('user.project')}
            options={projects}
            getOptionLabel={(option) => `${option.client?.shortName ? `${option.client?.shortName} > ` : `${option.client?.name} > `}${option.name}`}
            theme="gray"

          />
          <FilterAutocomplete
            multiple
            filterKey="employmentProjectTypes"
            label={t('user.cooperationType')}
            labelKey="label"
            theme="gray"
            options={Object.values(PROJECT_TYPES).map(item => ({ _id: item.value, label: item.label }))}
            disabled={loading}
          />
          <FilterAutocomplete
            filterKey="workTypes"
            theme="gray"
            options={translatedWorkTypes}
            valueKey="value"
            labelKey="label"
            label={t('user.workTypes')}
            multiple
            disabled={loading}
          />
          <FilterAutocomplete
            filterKey="recruiters"
            theme="gray"
            options={recruiters}
            getOptionLabel={(item) => `${item.name} ${item.surname}, ${item.roles.map((r: IRole) => r.name).join(',')}`}
            valueKey="_id"
            label={t('user.recruiter')}
            multiple
            disabled={loading}
          />
          <FilterAutocomplete
            filterKey="sexes"
            theme="gray"
            options={translatedSexes}
            valueKey="value"
            labelKey="label"
            label={t('user.sex')}
            multiple
            disabled={loading}
          />
          <FilterAutocomplete
            filterKey="countries"
            theme="gray"
            options={COUNTRIES?.map((item) => ({ _id: item.value, label: item.value })) || []}
            valueKey="_id"
            labelKey="label"
            label={t('user.country')}
            multiple
            disabled={loading}
          />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <Table
          activeCols={activeCols}
          setActiveCols={setActiveCols}
          data={!data.length ? startData : data}
          customFields={userBindings}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          isFetching={isFetchingStartData}
        />
      </div>
      {openPrintDialog && (
        <PrintDocDialog
          users={selectedItems}
          open={openPrintDialog}
          onClose={() => void setOpenPrintDialog(false)}
        />
      )}
    </ProfileListPageWrapper>
  );
};

export default function ProfileListPage () {
  return (
    <FiltersProvider>
      <FilterBarVisibilityProvider>
        <ProfileListPageRender />
      </FilterBarVisibilityProvider>
    </FiltersProvider>
  );
};
