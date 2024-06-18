import React, { memo } from 'react';
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
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

import PrepaymentRow from '../PrepaymentRow';

import { TableWrapper } from './styles';

type Props = {
  activeCols: string[];
  data: IPrepayment[];
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

  const toggleSorting = (prepaymentKey: string) => {
    let sortingValue: SortingValue<IPrepayment> = prepaymentKey as keyof IPrepayment;
    if (prepaymentKey === 'user') {
      sortingValue = 'userFullname';
    }
    if (prepaymentKey === 'user.project') {
      sortingValue = 'project.name';
    }
    if (prepaymentKey === 'comment') {
      sortingValue = 'userComment';
    }
    sortingToggler(prepaymentKey, sortingValue);
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
        {pageItems.map((prepayment: IPrepayment) => (
          <PrepaymentRow
            key={prepayment._id}
            data={prepayment}
            cols={activeCols}
          />
        ))}
        {!pageItems.length && isFetching && (
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
