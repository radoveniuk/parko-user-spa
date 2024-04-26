import React, { Dispatch, memo, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';

import { ArrowUpIcon } from 'components/icons';
import ListTable from 'components/shared/ListTable';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import { Path } from 'interfaces/base.types';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import ParticipationRow from '../ParticipationRow';

import { TableWrapper } from './styles';

const STATIC_COLS = ['', 'user.name', 'order.activeStage', 'order.screaning', 'order.createdAt', 'order.createdBy', ''];

type Props = {
  data: IOrderParticipation<true>[];
  setSelectedItems: Dispatch<SetStateAction<IOrderParticipation<true>[]>>;
  selectedItems: IOrderParticipation<true>[];
};

const Table = ({
  data, selectedItems, setSelectedItems,
}: Props) => {
  const { t } = useTranslation();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData);

  const toggleSorting = (participationKey: string) => {
    let sortingValue = participationKey as Path<IOrderParticipation<true>> | ((v: IOrderParticipation<true>) => any);
    if (participationKey === 'user.name') {
      sortingValue = 'user.fullname';
    }
    if (participationKey === 'order.activeStage') {
      sortingValue = (v: IOrderParticipation<true>) => v.stages?.[v.stages.length - 1]?.stage.name;
    }
    if (participationKey === 'order.createdAt') {
      sortingValue = 'createdAt';
    }
    if (participationKey === 'order.createdBy') {
      sortingValue = 'createdBy.fullname';
    }
    sortingToggler(participationKey, sortingValue);
  };

  const { remove } = useOrderParticipationActions();

  return (
    <TableWrapper>
      <ListTable
        columns={STATIC_COLS}
        className="users-table"
        columnComponent={(col) => {
          if (col && !['order.screaning'].includes(col)) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col as keyof IOrderParticipation<true>)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col as keyof IOrderParticipation<true>)
                      ? `sort-btn active ${sorting.dir}`
                      : 'sort-btn'
                  }
                >
                  <ArrowUpIcon />
                </IconButton>
              </div>
            );
          }
        }}
      >
        {pageItems.map((participation) => (
          <ParticipationRow
            key={participation._id}
            participation={participation}
            selected={selectedItems.some(item => item._id === participation._id)}
            onChangeSelect={checked => {
              setSelectedItems(prev => {
                if (checked) {
                  return [...prev, participation];
                }
                return prev.filter(item => item._id !== participation._id);
              });
            }}
            onDelete={() => {
              remove(participation._id);
            }}
          />
        ))}
      </ListTable>
      <div className="pagination-bottom">
        <Pagination {...paginationConfig} labelRowsPerPage={t('rowsPerPage')}/>
      </div>
    </TableWrapper>
  );
};

export default memo(Table);
