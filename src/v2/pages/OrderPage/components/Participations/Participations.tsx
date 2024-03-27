import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from 'v2/uikit/Autocomplete';

import { FiltersProvider } from 'components/shared/Filters';
import { getDateFromIso } from 'helpers/datetime';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import HeaderTable from './HeaderTable';
import { FilterTableWrapper, ProfilesWrapper } from './styles';
import Table from './Table';

type Props = {
  participations: IOrderParticipation<true>[];
};

const Profiles = ({ participations }: Props) => {
  const { t } = useTranslation();

  const [searchFilter, setSearchFilter] = useState<IOrderParticipation<true>[]>([]);

  const tableParticipations = useMemo(() => {
    let result = [...participations];
    if (searchFilter.length) {
      result = participations.filter((item) => searchFilter.some(searchFilterItem => searchFilterItem._id === item._id));
    }
    return result;
  }, [participations, searchFilter]);

  return (
    <FiltersProvider>
      <ProfilesWrapper>
        <HeaderTable
          count={participations.length}
        />
        <FilterTableWrapper>
          <Autocomplete
            label={t('search')}
            multiple
            options={participations}
            theme="gray"
            getOptionLabel={(item) => `${item.user.fullname} (${getDateFromIso(item.createdAt, 'dd.MM.yyyy HH:mm')})`}
            onChange={setSearchFilter}
            value={searchFilter}
          />
        </FilterTableWrapper>
        <Table data={tableParticipations} />
      </ProfilesWrapper>
    </FiltersProvider>
  );
};

export default Profiles;
