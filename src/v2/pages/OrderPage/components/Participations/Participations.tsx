import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrintDocDialog from 'v2/components/PrintDocDialog';
import Autocomplete from 'v2/uikit/Autocomplete';
import IconButton from 'v2/uikit/IconButton';

import { ClearFiltersIcon } from 'components/icons';
import { FiltersProvider } from 'components/shared/Filters';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { IOrder } from 'interfaces/order.interface';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IUser } from 'interfaces/users.interface';

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
  const [stagesFilter, { toggle: toggleStageFilter }, setStagesFilter] = useListState<string>([]);

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

  // print
  const [selectedItems, setSelectedItems] = useState<IOrderParticipation<true>[]>([]);
  const selectedItemsState = { selectedItems, setSelectedItems };
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  return (
    <FiltersProvider>
      <ProfilesWrapper>
        <HeaderTable participations={participations} setOpenPrintDialog={setOpenPrintDialog} {...selectedItemsState} />
        <FilterTableWrapper>
          <Autocomplete
            label={t('search')}
            multiple
            options={participations}
            theme="gray"
            getOptionLabel={(item) => <>{item.user.fullname}<br />{getDateFromIso(item.createdAt, 'dd.MM.yyyy HH:mm')}</>}
            onChange={setSearchFilter}
            value={searchFilter}
          />
          {order.stages.map((stage) => {
            const [background, color] = ORDER_STAGE_COLORS[stage.color];
            return (
              <FilterButton
                key={stage.name}
                style={{ background, color, border: `1px dashed ${stagesFilter.includes(stage.name) ? color : 'transparent'}` }}
                onClick={() => {
                  toggleStageFilter(stage.name);
                }}
                className={stagesFilter.includes(stage.name) ? 'active' : ''}
              >
                {stage.name}
              </FilterButton>
            );
          })}
          <IconButton
            onClick={() => { setSearchFilter([]); setStagesFilter([]); }}
            disabled={!searchFilter.length && !stagesFilter.length}
          >
            <ClearFiltersIcon />
          </IconButton>
        </FilterTableWrapper>
        <div className="mobile-list">
          {tableParticipations.map((item) => (
            <MobileParticipationCard key={item._id} participation={item} />
          ))}
        </div>
        <Table data={tableParticipations} {...selectedItemsState} />
      </ProfilesWrapper>
      {openPrintDialog && (
        <PrintDocDialog
          users={selectedItems.map(participation => participation.user as Pick<IUser, '_id' | 'fullname' | 'name' | 'surname'>)}
          open={openPrintDialog}
          onClose={() => void setOpenPrintDialog(false)}
        />
      )}
    </FiltersProvider>
  );
};

export default Profiles;
