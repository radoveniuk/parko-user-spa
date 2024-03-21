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
import { ICustomFormField } from 'interfaces/form.interface';
import { IUser } from 'interfaces/users.interface';

import FormFieldsRow from '../FormFieldsRow';

import { TableWrapper } from './styles';

const COLS = [
  'customForms.fieldName',
  'customForms.fieldType',
  'customForms.fieldCreatedAt',
  '',
];

type Props = {
  data: ICustomFormField[];
  isFetching?: boolean;
};

const Table = ({
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();

  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });

  const toggleSorting = (key: string) => {
    const sortingValue: SortingValue<ICustomFormField> = key as keyof ICustomFormField;

    // if (key === 'docsTemplates.template') {
    //   sortingValue = 'name';
    // }
    // if (key === 'file.name') {
    //   sortingValue = 'file.originalname';
    // }
    // if (key === 'docsTemplates.category') {
    //   sortingValue = 'category';
    // }
    // if (key === 'docsTemplates.createdAt') {
    //   sortingValue = 'createdAt';
    // }

    sortingToggler(key, sortingValue);
  };

  return (
    <TableWrapper>
      <ListTable
        columns={COLS}
        className="fields-table"
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
          <FormFieldsRow
            key={item._id}
            data={item}
          />
        ))}
        {!pageItems.length && isFetching && (
          iterateMap(20, (index) => (
            <ListTableRow key={index}>
              {COLS.map((emptyCol, emptyColIndex) => (
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
