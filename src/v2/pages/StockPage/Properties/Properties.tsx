import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClearFiltersButton, FilterAutocomplete, FilterDate, FiltersProvider, useFilters } from 'v2/components/Filters';

import { useGetProperties, useGetPropertiesFilters } from 'api/query/propertyQuery';

import { ColumnsProvider } from '../contexts/ColumnsContext';

import HeaderTable from './HeaderTable';
import MobilePropertyCard from './MobilePropertyCard';
import { FilterTableWrapper, PropertiesWrapper } from './styles';
import Table from './Table';

const PropertiesRender = () => {
  const { debouncedFiltersState } = useFilters();
  const { data: properties = [], isFetching, isLoading } = useGetProperties(debouncedFiltersState);
  const { data: propertiesFilters = [], isFetching: isFetchingPropertiesFilter } = useGetPropertiesFilters();

  const { t } = useTranslation();

  return (
    <PropertiesWrapper>
      <div className="container-table">
        <HeaderTable count={properties.length} />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={propertiesFilters.ids}
            filterKey="ids"
            label={t('stock.internalName')}
            labelKey="label"
            disabled={isFetchingPropertiesFilter}
          />
          <FilterAutocomplete
            multiple
            options={propertiesFilters.statuses}
            filterKey="statuses"
            label={t('stock.status')}
            getOptionLabel={option => t(`selects.propertyStatus.${option._id}`)}
            disabled={isFetchingPropertiesFilter}
          />
          <FilterAutocomplete
            multiple
            options={propertiesFilters.tradeNames}
            filterKey="tradeNames"
            label={t('stock.tradeName')}
            labelKey="_id"
            valueKey="_id"
            disabled={isFetchingPropertiesFilter}
          />
          <FilterAutocomplete
            multiple
            options={propertiesFilters.invoiceNumbers}
            filterKey="invoiceNumbers"
            label={t('stock.invoiceNumber')}
            labelKey="_id"
            disabled={isFetchingPropertiesFilter}
          />
          <FilterAutocomplete
            multiple
            options={propertiesFilters.distributorICOs}
            filterKey="distributorICOs"
            label={t('stock.distributorICO')}
            labelKey="_id"
            disabled={isFetchingPropertiesFilter}
          />
          <FilterAutocomplete
            multiple
            options={propertiesFilters.orderers}
            filterKey="orderers"
            label={t('stock.orderer')}
            labelKey="label"
            disabled={isFetchingPropertiesFilter}
          />
          <FilterDate
            label={t('stock.invoiceDeliveryDateFrom')}
            filterKey="invoiceDeliveryDateFrom"
          />
          <FilterDate
            label={t('stock.invoiceDeliveryDateTo')}
            filterKey="invoiceDeliveryDateTo"
          />
          <FilterDate
            label={t('stock.deliveryDateFrom')}
            filterKey="deliveryDateFrom"
          />
          <FilterDate
            label={t('stock.deliveryDateTo')}
            filterKey="deliveryDateTo"
          />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <div className="mobile-list">
          {properties.map((property) => (
            <MobilePropertyCard
              key={property._id}
              data={property}
            />
          ))}
        </div>
        <Table
          data={properties}
          isFetching={isFetching || isLoading}
        />
      </div>
    </PropertiesWrapper>
  );
};

export default function Properties () {
  const DEFAULT_COLS = [
    'stock.internalName',
    'stock.count',
    'stock.availableCount',
    'stock.status',
  ];
  return (
    <FiltersProvider localStorageKey="properties">
      <ColumnsProvider defaultValue={DEFAULT_COLS} localStorageKey="propertiesTableCols">
        <PropertiesRender />
      </ColumnsProvider>
    </FiltersProvider>
  );
};
