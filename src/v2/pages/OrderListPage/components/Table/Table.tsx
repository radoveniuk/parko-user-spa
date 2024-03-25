import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';
import Skeleton from 'v2/uikit/Skeleton';

import { ArrowUpIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { iterateMap } from 'helpers/iterateMap';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IClient } from 'interfaces/client.interface';
import { IOrder } from 'interfaces/order.interface';
import { IUser } from 'interfaces/users.interface';

import ProfileRow from '../OrderRow';

import { TableWrapper } from './styles';

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

  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });

  const toggleSorting = (orderKey: string) => {
    // let sortingValue: SortingValue<IPrepayment> = prepaymentKey as keyof IPrepayment;
    // if (prepaymentKey === 'user') {
    //   sortingValue = 'user.name';
    // }
    // if (prepaymentKey === 'user.project') {
    //   sortingValue = 'user.project.name';
    // }
    // if (prepaymentKey === 'comment') {
    //   sortingValue = 'userComment';
    // }
    // sortingToggler(prepaymentKey, sortingValue);
  };

  const allCols = activeCols;

  return (
    <TableWrapper>
      <ListTable
        columns={allCols}
        className="prepayments-table"
        columnComponent={(col) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('prepayment.', '') as keyof IClient)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === (col.replace('client.', '') as keyof IUser)
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
          <ProfileRow
            key={item._id}
            data={item}
            cols={activeCols}
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
        <Pagination {...paginationConfig} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} labelRowsPerPage={t('rowsPerPage')}/>
      </div>
    </TableWrapper>
  );
};

export default memo(Table);
