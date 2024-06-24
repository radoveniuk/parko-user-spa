import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClearFiltersButton, FilterAutocomplete, FiltersProvider, useFilters } from 'v2/components/Filters';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetProjectAccommodations } from 'api/query/projectAccommodationsQuery';

import HeaderTable from './HeaderTable';
import MobileProjectAccommodationCard from './MobileProjectAccommodationCard';
import { FilterTableWrapper, ProjectAccommodationsWrapper } from './styles';
import Table from './Table';

const COLUMNS = [
  'accommodation.client',
  'accommodation.project',
  'accommodation.name',
  'accommodation.adress',
  '',
];

const ProjectAccommodations = () => {
  const { t } = useTranslation();
  const { debouncedFiltersState } = useFilters();
  const { data: tableData = [], isFetching } = useGetProjectAccommodations(debouncedFiltersState);
  const { data: accommodations = [] } = useGetAccommodations();
  return (
    <ProjectAccommodationsWrapper>
      <div className="container-table">
        <HeaderTable count={tableData.length} />
        <FilterTableWrapper>
          <FilterAutocomplete
            filterKey="accommodation"
            label={t('accommodation.adress')}
            options={accommodations}
            labelKey="adress"
          />
          <ClearFiltersButton />
        </FilterTableWrapper>
        <div className="mobile-list">
          {tableData.map((rowItem) => (
            <MobileProjectAccommodationCard
              key={rowItem._id}
              data={rowItem}
            />
          ))}
        </div>
        <Table
          activeCols={COLUMNS}
          data={tableData}
          isFetching={isFetching}
        />
      </div>
    </ProjectAccommodationsWrapper>
  );
};

const ProjectAccommodationsWithFilters = () => (
  <FiltersProvider>
    <ProjectAccommodations />
  </FiltersProvider>
);

export default ProjectAccommodationsWithFilters;
