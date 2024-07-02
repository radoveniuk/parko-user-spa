import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersProvider, useFilters } from 'v2/components/Filters';
import { ClearFiltersButton, FilterAutocomplete, FilterDate, FilterSelect } from 'v2/components/Filters/Filters';
import { TableColumnsProvider, useTableColumns } from 'v2/contexts/TableColumnsContext';
import { TableSelectedItemsProvider } from 'v2/contexts/TableSelectedItemsContext';

import { useGetResidenceFilterLists, useGetResidences } from 'api/query/residenceQuery';
import usePrev from 'hooks/usePrev';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';

import { useActiveResidence } from '../contexts/ResidenceContext';

import HeaderTable from './HeaderTable';
import MobileResidenceCard from './MobileResidenceCard';
import { FilterTableWrapper, ResidencesWrapper } from './styles';
import Table from './Table';

const Residences = () => {
  const { t } = useTranslation();
  const { debouncedFiltersState, removeFilter } = useFilters();
  const { data: filters, refetch: refetchFilters } = useGetResidenceFilterLists();
  const activeOptions = useTranslatedSelect(['true', 'false']);

  const { data: residences = [], refetch, isFetching, isLoading } = useGetResidences(debouncedFiltersState);

  const [openResidence] = useActiveResidence();

  const prevResidence = usePrev(openResidence);
  useEffect(() => {
    if ((!!prevResidence && !openResidence)) {
      refetch();
      refetchFilters();
    }
  }, [openResidence, prevResidence, refetch, refetchFilters]);

  const [activeCols] = useTableColumns();

  return (
    <ResidencesWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable data={residences} />
        <FilterTableWrapper>
          <FilterDate label={t('firstDate')} filterKey="firstDate" />
          <FilterDate label={t('lastDate')} filterKey="lastDate" />
          <FilterSelect filterKey="active" label={t('accommodation.active')} options={activeOptions} emptyItem={t('selectAll')} />
          {filters?.users && (
            <FilterAutocomplete
              filterKey="user"
              label={t('navbar.profiles')}
              options={filters.users}
              getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
            />
          )}
          {filters?.clients && (
            <FilterAutocomplete
              filterKey="client"
              label={t('user.client')}
              options={filters.clients}
              labelKey="shortName"
              multiple
              onChange={() => {
                removeFilter('project');
              }}
            />
          )}
          {filters?.projects && (
            <FilterAutocomplete
              filterKey="project"
              label={t('user.project')}
              options={filters.projects.filter(project => debouncedFiltersState?.client?.includes((project.client as IClient)._id))}
              getOptionLabel={(item) => `${item.client.shortName} > ${item?.name}`}
              disabled={!debouncedFiltersState?.client}
              multiple
            />
          )}
          {filters?.addresses && (
            <FilterAutocomplete
              filterKey="accommodationAddress"
              label={t('accommodation.adress')}
              options={filters?.addresses.map(label => ({ label, _id: label }))}
              labelKey="label"
            />
          )}
          {filters?.businessNames && (
            <FilterAutocomplete
              filterKey="accommodationBusinessName"
              label={t('accommodation.businessName')}
              options={filters?.businessNames.map(bName => ({ label: bName, _id: bName }))}
              labelKey="label"
            />
          )}
          <ClearFiltersButton />
        </FilterTableWrapper>
        <div className="mobile-list">
          {residences.map((rowItem) => (
            <MobileResidenceCard
              key={rowItem._id}
              data={rowItem}
            />
          ))}
        </div>
        <Table
          data={residences}
          isFetching={isFetching || isLoading}
        />
      </div>
    </ResidencesWrapper>
  );
};

export default function ResidencesWithFilters () {
  const COLUMNS = [
    'accommodation.userFullname',
    'accommodation.name',
    'accommodation.adress',
    'accommodation.checkIn',
    'accommodation.checkOut',
    'accommodation.days',
    'accommodation.costNight',
    'accommodation.costMonth',
    'accommodation.sum',
  ];
  return (
    <FiltersProvider>
      <TableColumnsProvider defaultValue={COLUMNS} localStorageKey="residences">
        <TableSelectedItemsProvider>
          <Residences />
        </TableSelectedItemsProvider>
      </TableColumnsProvider>
    </FiltersProvider>
  );
};
