import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetResidenceFilterLists, useGetResidences } from 'api/query/residenceQuery';
import { FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiltersButton, FilterAutocomplete, FilterDate, FilterSelect, FilterText } from 'components/shared/Filters/Filters';
import { getDateFromIso } from 'helpers/datetime';
import usePrev from 'hooks/usePrev';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { useActiveAccommodation } from '../contexts/AccommodationContext';
import { useActiveResidence } from '../contexts/ResidenceContext';

import MobileResidenceCard from './MobileResidenceCard/MobileResidenceCard';
import HeaderTable from './HeaderTable';
import { FilterTableWrapper, ResidencesWrapper } from './styles';
import Table from './Table';
import { ResidenceTableRow } from './types';

const COLUMNS = [
  'user.name',
  'user.project',
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.checkIn',
  'accommodation.checkOut',
  'accommodation.days',
  'accommodation.costNight',
  'accommodation.sum',
  '',
];

const Residences = () => {
  const { t } = useTranslation();
  const { debouncedFiltersState } = useFilters();
  const { data: filters, refetch: refetchFilters } = useGetResidenceFilterLists();
  const { data: accommodations = [] } = useGetAccommodations();
  const activeOptions = useTranslatedSelect(['true', 'false']);

  const getDays = useCallback((residence: IResidence) => {
    if (!residence.checkInDate) return null;

    let checkIn = DateTime.fromISO(residence.checkInDate);

    if (
      debouncedFiltersState?.firstDate &&
      DateTime.fromISO(debouncedFiltersState?.firstDate).toMillis() > DateTime.fromISO(residence.checkInDate).toMillis()
    ) {
      checkIn = DateTime.fromISO(debouncedFiltersState?.firstDate);
    }

    if (debouncedFiltersState?.lastDate || residence.checkOutDate) {
      const checkOut = DateTime.fromISO(debouncedFiltersState?.lastDate || residence.checkOutDate);
      const diff = -checkIn.diff(checkOut, 'days').days.toFixed();
      return diff > 0 ? diff : 0;
    }

    const diff = -checkIn.diffNow('days').days.toFixed();
    return diff > 0 ? diff + 1 : 0;
  }, [debouncedFiltersState?.firstDate, debouncedFiltersState?.lastDate]);

  const { data: residences = [], refetch, remove, isFetching, isLoading } = useGetResidences(debouncedFiltersState, { enabled: false });
  const tableData: ResidenceTableRow[] = useMemo(() => residences.map((item) => {
    const { name, surname, project } = item.user as IUser;
    const { owner, adress, costNight } = item.accommodation as IAccommodation;
    const days = getDays(item) || 0;
    return {
      _id: item._id,
      user: `${name} ${surname}`,
      project: (project as IProject)?.name,
      owner,
      adress,
      checkInDate: getDateFromIso(item.checkInDate),
      checkOutDate: getDateFromIso(item.checkOutDate),
      days,
      costNight,
      sum: days * Number(costNight),
      metadata: item,
    };
  }), [getDays, residences]);

  const [openResidence] = useActiveResidence();
  const [openAccomodation] = useActiveAccommodation();

  const prevResidence = usePrev(openResidence);
  const prevAccommodation = usePrev(openAccomodation);
  useEffect(() => {
    if ((!!prevResidence && !openResidence) || (!!prevAccommodation && !openAccomodation)) {
      refetch();
      refetchFilters();
    }
  }, [openAccomodation, openResidence, prevAccommodation, prevResidence, refetch, refetchFilters]);

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => void remove;
  }, [debouncedFiltersState, refetch, remove]);

  return (
    <ResidencesWrapper>
      <div className="container-table">
        <HeaderTable count={tableData.length} />
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
          <FilterText filterKey="accommodationOwner" label={t('accommodation.owner')} />
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
            <MobileResidenceCard
              key={rowItem._id}
              data={rowItem}
            />
          ))}
        </div>
        <Table
          activeCols={COLUMNS}
          data={tableData}
          isFetching={isFetching || isLoading}
        />
      </div>
    </ResidencesWrapper>
  );
};

export default function ResidencesWithFilters () {
  return (
    <FiltersProvider>
      <Residences />
    </FiltersProvider>
  );
};
