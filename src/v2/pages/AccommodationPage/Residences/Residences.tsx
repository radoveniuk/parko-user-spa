import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersProvider, useFilters } from 'v2/components/Filters';
import { ClearFiltersButton, FilterAutocomplete, FilterDate, FilterSelect, FilterText } from 'v2/components/Filters/Filters';
import { TableColumnsProvider, useTableColumns } from 'v2/contexts/TableColumnsContext';
import { TableSelectedItemsProvider } from 'v2/contexts/TableSelectedItemsContext';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetResidenceFilterLists, useGetResidences } from 'api/query/residenceQuery';
import usePrev from 'hooks/usePrev';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import { useActiveResidence } from '../contexts/ResidenceContext';

import HeaderTable from './HeaderTable';
import MobileResidenceCard from './MobileResidenceCard';
import { FilterTableWrapper, ResidencesWrapper } from './styles';
import Table from './Table';

const Residences = () => {
  const { t } = useTranslation();
  const { debouncedFiltersState } = useFilters();
  const { data: filters, refetch: refetchFilters } = useGetResidenceFilterLists();
  const { data: accommodations = [] } = useGetAccommodations();
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
          {filters?.projects && (
            <FilterAutocomplete
              filterKey="project"
              label={t('user.project')}
              options={filters.projects}
              getOptionLabel={(item) => `${item.client ? `${item.client.name} > ` : ''}${item?.name}`}
            />
          )}
          <FilterText filterKey="accommodationOwner" label={t('accommodation.name')} />
          <FilterAutocomplete
            filterKey="accommodation"
            label={t('accommodation.adress')}
            options={accommodations}
            labelKey="adress"
          />
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
