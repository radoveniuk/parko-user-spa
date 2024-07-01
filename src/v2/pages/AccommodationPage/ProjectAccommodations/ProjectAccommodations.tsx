import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClearFiltersButton, FilterAutocomplete, FiltersProvider, useFilters } from 'v2/components/Filters';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetClients } from 'api/query/clientQuery';
import { useGetProjectAccommodations } from 'api/query/projectAccommodationsQuery';
import { useGetProjects } from 'api/query/projectQuery';

import HeaderTable from './HeaderTable';
import MobileProjectAccommodationCard from './MobileProjectAccommodationCard';
import { FilterTableWrapper, ProjectAccommodationsWrapper } from './styles';
import Table from './Table';

const COLUMNS = [
  'accommodation.client',
  'accommodation.project',
  'accommodation.name',
  'accommodation.adress',
  'accommodation.payer',
  'accommodation.damageCompencationTariff',
  'accommodation.damageCompencationPrice',
  'accommodation.reinvoicingTariff',
  'accommodation.reinvoicingPrice',
  '',
];

const ProjectAccommodations = () => {
  const { t } = useTranslation();
  const { debouncedFiltersState } = useFilters();
  const { data: tableData = [], isFetching } = useGetProjectAccommodations(debouncedFiltersState);
  const { data: clients = [] } = useGetClients();
  const { data: projects = [] } = useGetProjects({ clients: debouncedFiltersState?.clients });
  const { data: accommodations = [] } = useGetAccommodations();
  return (
    <ProjectAccommodationsWrapper>
      <div className="container-table">
        <HeaderTable count={tableData.length} />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            filterKey="clients"
            options={clients}
            labelKey="shortName"
            label={t('accommodation.client')}
          />
          <FilterAutocomplete
            multiple
            filterKey="projects"
            options={projects}
            labelKey="name"
            label={t('accommodation.project')}
            disabled={!debouncedFiltersState?.clients}
          />
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
