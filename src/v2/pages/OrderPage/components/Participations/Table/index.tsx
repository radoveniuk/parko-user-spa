import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const STATIC_COLS = ['user.name', 'order.activeStage', 'order.screaning', 'order.createdAt', 'order.createdBy', ''];

type Props = {
  data: IOrderParticipation<true>[];
};
const Table = ({
  data,
}: Props) => {
  const { t } = useTranslation();

  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });

  const toggleSorting = (participationKey: keyof IOrderParticipation) => {
    const sortingValue: Path<IOrderParticipation> | ((v: IOrderParticipation) => any) = participationKey;
    sortingToggler(participationKey, sortingValue);
  };

  return (
    <TableWrapper>
      <div className="mobile-list">
        {/* {sortedData.map((user) => (
          <MobileUserCard
            key={user._id}
            user={user}
            selected={selectedItems.some(item => item._id === user._id)}
            onSelect={checked => {
              setSelectedItems(prev => {
                if (checked) {
                  return [...prev, user];
                }
                return prev.filter(item => item._id !== user._id);
              });
            }}
          />
        ))} */}
      </div>
      <ListTable
        columns={STATIC_COLS}
        className="users-table"
        columnComponent={(col, index) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('user.', '') as keyof IOrderParticipation<true>)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('user.', '') as keyof IOrderParticipation<true>)
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
          />
        ))}
      </ListTable>
      <div className="pagination-bottom">
        <Pagination {...paginationConfig} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} labelRowsPerPage={t('rowsPerPage')}/>
      </div>
    </TableWrapper>
  );
};

export default memo(Table);
