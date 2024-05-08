import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash-es/cloneDeep';
import { ClearFiltersButton, FilterAutocomplete, FiltersProvider, useFilters } from 'v2/components/Filters';
import PrintDocDialog from 'v2/components/PrintDocDialog';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetCustomFormFieldSectionBindings } from 'api/query/customFormsQuery';
import { useGetUserList, useGetUserListForFilter, useGetUsersDetailedFilters } from 'api/query/userQuery';
import { SearchIcon } from 'components/icons';
import { isMongoId } from 'helpers/regex';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import FilterBarVisibilityProvider, { useFilterBarVisibility } from './contexts/FilterBarVisibilityContext';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

function usePrevQueryData (value: any) {
  const ref = useRef();
  useEffect(() => {
    if (value) {
      ref.current = value;
    }
  }, [value]);

  return ref.current as any;
}

const DEFAULT_COLS = ['user.email'];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('profileList'));

  const { debouncedFiltersState, filtersState, removeFilter } = useFilters();

  // table content
  const [startFilterState] = useState(filtersState);
  const { data: startData = [], isFetching: isFetchingStartData, remove: removeStartData } =
  useGetUserList({ take: 20, skip: 0, ...startFilterState });
  const { data = [], remove, isFetching, isLoading, isFirstTimeFetched } = useGetUserList(debouncedFiltersState);
  const prevData = usePrevQueryData(data);

  // filters
  const { data: usersFilter = [] } = useGetUserListForFilter();
  const { data: detailedFilters } = useGetUsersDetailedFilters(debouncedFiltersState);
  const prevDetailedFilters = usePrevQueryData(detailedFilters);

  // print
  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

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

  useEffect(() => {
    if (filtersState) {
      const filterColumnMap: Record<string, string> = {
        statuses: 'user.status',
        clients: 'user.client',
        projects: 'user.project',
        workTypes: 'user.workTypes',
        recruiters: 'user.recruiter',
        sexes: 'user.sex',
        countries: 'user.country',
        // employmentProjectTypes: ''
      };
      setActiveCols((prev) => {
        const cols = cloneDeep(prev);
        Object.keys(filterColumnMap).forEach((filterKey) => {
          const col = filterColumnMap[filterKey];
          if (filtersState[filterKey] && !cols.includes(col)) {
            cols.push(col);
          }
        });
        return cols;
      });
    }
  }, [filtersState]);

  // reset projects filter after reseting client
  useEffect(() => {
    if (!filtersState?.clients?.length) {
      removeFilter('projects');
    }
  }, [filtersState?.clients, removeFilter]);

  // cleanup
  useEffect(() => () => { remove(); removeStartData(); }, [remove, removeStartData]);

  const loading = isLoading || isFetching || isFetchingStartData;

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setOpenPrintDialog={setOpenPrintDialog}
          data={!isFirstTimeFetched ? startData : data}
          activeCols={activeCols}
          customFields={userBindings}
          loading={loading}
          detailedFilters={detailedFilters || prevDetailedFilters}
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
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            multiple
            filterKey="statuses"
            label={t('user.status')}
            options={detailedFilters?.statuses || prevDetailedFilters?.statuses || []}
            getOptionLabel={(option) => `${t(`selects.userStatus.${option._id}`)} (${option.count})`}
            theme="gray"
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            multiple
            filterKey="clients"
            label={t('project.client')}
            options={detailedFilters?.clients || prevDetailedFilters?.clients || []}
            getOptionLabel={(option) => `${option.label} (${option.count})`}
            theme="gray"
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            disabled={!debouncedFiltersState?.clients || !isFirstTimeFetched}
            multiple
            filterKey="projects"
            label={t('user.project')}
            options={detailedFilters?.projects || prevDetailedFilters?.projects || []}
            getOptionLabel={(option) => `${option.label} (${option.count})`}
            theme="gray"
          />
          <FilterAutocomplete
            multiple
            filterKey="employmentProjectTypes"
            label={t('user.cooperationType')}
            theme="gray"
            options={detailedFilters?.employmentProjectTypes || prevDetailedFilters?.employmentProjectTypes || []}
            getOptionLabel={(option) => `${option._id} (${option.count})`}
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            filterKey="workTypes"
            theme="gray"
            options={detailedFilters?.workTypes || prevDetailedFilters?.workTypes || []}
            getOptionLabel={(option) => `${t(`selects.userWorkType.${option._id}`)} (${option.count})`}
            label={t('user.workTypes')}
            multiple
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            filterKey="recruiters"
            theme="gray"
            options={detailedFilters?.recruiters || prevDetailedFilters?.recruiters || []}
            getOptionLabel={(option) => `${option.label} (${option.count})`}
            label={t('user.recruiter')}
            multiple
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            filterKey="sexes"
            theme="gray"
            options={detailedFilters?.sexes || prevDetailedFilters?.sexes || []}
            getOptionLabel={(option) => `${t(option._id)} (${option.count})`}
            label={t('user.sex')}
            multiple
            disabled={!isFirstTimeFetched}
          />
          <FilterAutocomplete
            filterKey="countries"
            theme="gray"
            options={detailedFilters?.countries || prevDetailedFilters?.countries || []}
            valueKey="_id"
            getOptionLabel={(option) => `${t(option._id)} (${option.count})`}
            label={t('user.country')}
            multiple
            disabled={!isFirstTimeFetched}
          />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <Table
          activeCols={activeCols}
          setActiveCols={setActiveCols}
          data={!isFirstTimeFetched ? startData : (data.length ? data : prevData)}
          customFields={userBindings}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          isFetching={isFetchingStartData || isFetching}
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
