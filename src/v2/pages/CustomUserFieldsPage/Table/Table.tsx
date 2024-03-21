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
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';

import BindingRow from '../BindingRow';

import { TableWrapper } from './styles';

const COLS = [
  'customForms.fieldName',
  'customForms.section',
  'docsTemplates.createdAt',
  '',
];

type Props = {
  data: ICustomFormFieldSectionBinding<true>[];
  isFetching?: boolean;
};

const Table = ({
  data,
  isFetching,
}: Props) => {
  const { t, i18n } = useTranslation();

  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });

  const toggleSorting = (key: string) => {
    const KEY_MAP: Record<string, SortingValue<ICustomFormFieldSectionBinding<true>>> = {
      'customForms.fieldName': `field.names.${i18n.language}`,
      'customForms.section': `section.names.${i18n.language}`,
      'docsTemplates.createdAt': 'createdAt',
    };

    sortingToggler(key, KEY_MAP[key]);
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
                onClick={() => void toggleSorting(col)}
              >
                {t(col)}
                <IconButton
                  className={
                    sorting?.key === col
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
          <BindingRow
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
