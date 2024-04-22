import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';
import Skeleton from 'v2/uikit/Skeleton';

import { useGetOrderParticipations } from 'api/query/orderParticipationQuery';
import { ArrowUpIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { iterateMap } from 'helpers/iterateMap';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IOrder } from 'interfaces/order.interface';

import OrderRow from '../OrderRow';

import { TableWrapper } from './styles';

const sortableCols = ['name', 'project', 'client', 'dateFrom', 'dateTo', 'createdBy', 'createdAt', 'cooperationType', 'status'];

type Props = {
  activeCols: string[];
  data: IOrder<true>[];
  isFetching?: boolean;
};

const Table = ({
  activeCols,
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData);

  const toggleSorting = (orderKey: string) => {
    let sortingValue = orderKey as SortingValue<IOrder<true>>;
    if (orderKey === 'client') {
      sortingValue = 'client.name';
    }
    if (orderKey === 'project') {
      sortingValue = 'project.name';
    }
    if (orderKey === 'createdBy') {
      sortingValue = 'createdBy.fullname';
    }
    sortingToggler(orderKey, sortingValue);
  };

  const allCols = activeCols;

  // order participations for stats
  const { data: participations = [] } = useGetOrderParticipations();

  return (
    <TableWrapper>
      <ListTable
        columns={allCols}
        className="orders-table"
        columnComponent={(col) => {
          if (col && sortableCols.includes(col.replace('order.', ''))) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('order.', ''))}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('order.', ''))
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
        {pageItems.map((item) => (
          <OrderRow
            key={item._id}
            data={item}
            participations={participations.filter(partItem => partItem.order._id === item._id)}
          />
        ))}
        {isFetching && (
          iterateMap(20, (index) => (
            <ListTableRow key={index}>
              {allCols.map((emptyCol, emptyColIndex) => (
                <ListTableCell key={emptyCol + emptyColIndex}><Skeleton /></ListTableCell>
              ))}
            </ListTableRow>
          ))
        )}
      </ListTable>
      <div className="pagination-bottom">
        <Pagination {...paginationConfig} labelRowsPerPage={t('rowsPerPage')}/>
      </div>
    </TableWrapper>
  );
};

export default memo(Table);
