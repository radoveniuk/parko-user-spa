import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from 'v2/uikit/Autocomplete';

import { FiltersProvider } from 'components/shared/Filters';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { IOrder } from 'interfaces/order.interface';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import HeaderTable from './HeaderTable';
import MobileParticipationCard from './MobileParticipationCard';
import { FilterButton, FilterTableWrapper, ProfilesWrapper } from './styles';
import Table from './Table';

type Props = {
  participations: IOrderParticipation<true>[];
  order: IOrder<true>;
};

const Profiles = ({ participations, order }: Props) => {
  const { t } = useTranslation();

  const [searchFilter, setSearchFilter] = useState<IOrderParticipation<true>[]>([]);
  const [stagesFilter, { toggle: toggleStageFilter }] = useListState<string>([]);

  const tableParticipations = useMemo(() => {
    let result = [...participations];
    if (searchFilter.length) {
      result = participations.filter((item) => searchFilter.some(searchFilterItem => searchFilterItem._id === item._id));
    }
    if (stagesFilter.length) {
      result = participations.filter((item) => stagesFilter.includes(item.stages[item.stages.length - 1]?.stage?.name));
    }
    return result;
  }, [participations, searchFilter, stagesFilter]);

  return (
    <FiltersProvider>
      <ProfilesWrapper>
        <HeaderTable count={participations.length} />
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
          {order.stages.map((stage) => {
            const [background, color] = ORDER_STAGE_COLORS[stage.color];
            return (
              <FilterButton
                key={stage.name}
                style={{ background, color, border: `1px dashed ${color}` }}
                onClick={() => {
                  toggleStageFilter(stage.name);
                }}
                className={stagesFilter.includes(stage.name) ? 'active' : ''}
              >
                {stage.name}
              </FilterButton>
            );
          })}
        </FilterTableWrapper>
        <div className="mobile-list">
          {tableParticipations.map((item) => (
            <MobileParticipationCard key={item._id} participation={item} />
          ))}
        </div>
        <Table data={tableParticipations} />
      </ProfilesWrapper>
    </FiltersProvider>
  );
};

export default Profiles;
