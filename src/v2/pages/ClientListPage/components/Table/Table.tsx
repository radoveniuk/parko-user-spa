import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';
import Skeleton from 'v2/uikit/Skeleton';

import { useUpdateClientMutation } from 'api/mutations/clientMutation';
import { ArrowUpIcon, SettingsIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { iterateMap } from 'helpers/iterateMap';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import ClientRow from '../ClientRow';
import ColumnsConfig from '../ColumnsConfig';

import { TableWrapper } from './styles';

type Props = {
  activeCols: string[];
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>;
  data: IClient[];
  isFetching?: boolean;
};

const Table = ({
  activeCols,
  data,
  setActiveCols,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData);

  const updateClientMutation = useUpdateClientMutation();

  const toggleSorting = (clientKey: keyof IClient) => {
    let sortingValue = clientKey as keyof IClient | ((v: IClient) => any);
    if (
      [
        'cooperationStartDate',
        'birthDate',
        'permitStartDate',
        'permitExpire',
        'cooperationEndDate',
        'permitType',
        'status',
        'source',
      ].includes(clientKey)
    ) {
      sortingValue = _ => _[clientKey] || null;
    }
    sortingToggler(clientKey, sortingValue);
  };

  const [openColsSettins, setOpenColsSettings] = useState(false);
  const [editingRow, setEditingRow] = useState<null | string>(null);

  const allCols = ['client.shortName', ...activeCols, ''];

  const updateClient = (values: IClient) => {
    console.log('update');

    updateClientMutation.mutate({
      ...values,
      managers: values.managers?.map(manager => (manager as IUser)._id) || [],
    });
    queryClient.setQueryData(['clients', '{}'], data.map((client) => client._id === values._id
      ? {
        ...values,
        managers: values.managers || client.managers,
      }
      : client));
  };

  return (
    <TableWrapper>
      <ListTable
        columns={allCols}
        className="clients-table"
        columnComponent={(col, index) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('client.', '') as keyof IClient)}
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
          if (!col && index !== 0) {
            return (
              <div className="table-settings-wrapper">
                <IconButton onClick={() => void setOpenColsSettings((prev) => !prev)}>
                  <SettingsIcon />
                </IconButton>
              </div>
            );
          }
        }}
      >
        {pageItems.map((client: IClient) => (
          <ClientRow
            key={client._id}
            data={client}
            cols={activeCols}
            editingMode={editingRow === client._id}
            startEdit={() => void setEditingRow(client._id)}
            saveEdit={(values) => {
              setEditingRow(null);
              updateClient(values);
            }}
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
      <ColumnsConfig
        activeCols={activeCols}
        setActiveCols={setActiveCols}
        open={openColsSettins}
        onClose={() => void setOpenColsSettings(false)}
      />
    </TableWrapper>
  );
};

export default memo(Table);
