import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersProvider } from 'v2/components/Filters';
import { Input } from 'v2/uikit';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import usePrev from 'hooks/usePrev';

import { useActiveAccommodation } from '../contexts/AccommodationContext';

import MobileAccommodationCard from './MobileAccommodationCard/MobileAccommodationCard';
import HeaderTable from './HeaderTable';
import { FilterTableWrapper, ResidencesWrapper } from './styles';
import Table from './Table';

const COLUMNS = [
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.costNight',
  'accommodation.costMonth',
  'accommodation.tariff',
  'accommodation.managerPhone',
  'accommodation.receptionPhone',
  'comment',
  '',
];

const AccommodationObjects = () => {
  const { data: accommodations = [], refetch, isFetching, isLoading } = useGetAccommodations();
  const { t } = useTranslation();

  const [openAccommodation] = useActiveAccommodation();
  const prevAccommodation = usePrev(openAccommodation);
  useEffect(() => {
    if (!!prevAccommodation && !openAccommodation) {
      refetch();
    }
  }, [openAccommodation, prevAccommodation, refetch]);

  const [searchValue, setSearchValue] = useState('');
  const filteredAccommodations = useMemo(() =>
    accommodations.filter((item) => item.adress.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.owner.toLowerCase().includes(searchValue.toLowerCase())), [accommodations, searchValue]);

  return (
    <ResidencesWrapper>
      <div className="container-table">
        <HeaderTable count={filteredAccommodations.length} />
        <FilterTableWrapper>
          <Input label={t('search')} theme="gray" value={searchValue} onChange={(e) => void setSearchValue(e.target.value)} />
        </FilterTableWrapper>
        <div className="mobile-list">
          {accommodations.map((rowItem) => (
            <MobileAccommodationCard
              key={rowItem._id}
              data={rowItem}
            />
          ))}
        </div>
        <Table
          activeCols={COLUMNS}
          data={filteredAccommodations}
          isFetching={isFetching || isLoading}
        />
      </div>
    </ResidencesWrapper>
  );
};

export default function ResidencesWithFilters () {
  return (
    <FiltersProvider>
      <AccommodationObjects />
    </FiltersProvider>
  );
};
