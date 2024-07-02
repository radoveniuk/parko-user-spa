import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersProvider, useFilters } from 'v2/components/Filters';
import { ClearFiltersButton, FilterAutocomplete, FilterDate } from 'v2/components/Filters/Filters';
import { TableColumnsProvider, useTableColumns } from 'v2/contexts/TableColumnsContext';
import { TableSelectedItemsProvider } from 'v2/contexts/TableSelectedItemsContext';

import { useGetPropertyMovements, useGetPropertyMovementsFilters } from 'api/query/propertyMovementQuery';

import HeaderTable from './HeaderTable';
import MobileMovementCard from './MobileMovementCard';
import { FilterTableWrapper, MovementsWrapper } from './styles';
import Table from './Table';

const MovementsRender = () => {
  const { t } = useTranslation();
  const { debouncedFiltersState } = useFilters();
  const { data: filters = {} } = useGetPropertyMovementsFilters();
  const { data: movements = [], isFetching, isLoading } = useGetPropertyMovements(debouncedFiltersState);
  const [activeCols] = useTableColumns();

  return (
    <MovementsWrapper cols={activeCols.length + 1}>
      <div className="container-table">
        <HeaderTable data={movements} />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            filterKey="users"
            options={filters.users}
            labelKey="label"
            label={t('stock.user')}
          />
          <FilterAutocomplete
            multiple
            filterKey="clients"
            options={filters.clients}
            labelKey="label"
            label={t('stock.client')}
          />
          <FilterAutocomplete
            multiple
            filterKey="projects"
            options={filters.projects}
            labelKey="label"
            label={t('stock.project')}
          />
          <FilterAutocomplete
            multiple
            filterKey="internalNames"
            options={filters.internalNames}
            labelKey="label"
            label={t('stock.internalName')}
          />
          <FilterAutocomplete
            multiple
            filterKey="contractors"
            options={filters.contractors}
            labelKey="label"
            label={t('stock.contractor')}
          />
          <FilterAutocomplete
            multiple
            filterKey="tradeNames"
            options={filters.tradeNames}
            labelKey="label"
            label={t('stock.tradeName')}
          />
          <FilterAutocomplete
            multiple
            filterKey="types"
            options={filters.types}
            getOptionLabel={(option) => t(`selects.propertyMovementType.${option._id}`)}
            label={t('stock.movementType')}
          />
          <FilterDate
            label={t('stock.dateFrom')}
            filterKey="dateFrom"
          />
          <FilterDate
            label={t('stock.dateTo')}
            filterKey="dateTo"
          />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <div className="mobile-list">
          {movements.map((rowItem) => (
            <MobileMovementCard
              key={rowItem._id}
              data={rowItem}
            />
          ))}
        </div>
        <Table
          data={movements}
          isFetching={isFetching || isLoading}
        />
      </div>
    </MovementsWrapper>
  );
};

export default function Movements () {
  const DEFAULT_COLS = [
    'stock.property',
    'stock.user',
    'stock.type',
    'stock.count',
    'stock.date',
  ];
  return (
    <FiltersProvider localStorageKey="property-movements">
      <TableColumnsProvider defaultValue={DEFAULT_COLS} localStorageKey="movementsTableCols">
        <TableSelectedItemsProvider>
          <MovementsRender />
        </TableSelectedItemsProvider>
      </TableColumnsProvider>
    </FiltersProvider>
  );
};
