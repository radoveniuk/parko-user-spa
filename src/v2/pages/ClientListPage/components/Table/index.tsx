import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';
import Skeleton from 'v2/uikit/Skeleton';

import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { ArrowUpIcon, SettingsIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { iterateMap } from 'helpers/iterateMap';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import { Path } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import ProfileRow from '../ProfileRow';
import SettingsTable from '../SettingsTable';

import { TableWrapper } from './styles';

type TTable = {
  activeCols: string[];
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>;
  data: IClient[];
};
const Table = ({
  activeCols,
  setActiveCols,
  data,
}: TTable) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { debouncedFiltersState } = useFilters();

  const [rowsPerPage, setRowsPerPage] = useState(20); // TODO remove
  const [editingRow, setEditingRow] = useState<null | string>(null);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });
  const updateUserMutation = useUpdateUserMutation();
  const { data: projects = [] } = useGetProjects();
  const { data: recruiters = [] } = useGetUserList({ role: 'recruiter' });

  const toggleSorting = (userKey: keyof IClient) => {
    let sortingValue: Path<IClient> | ((v: IClient) => any) = userKey;
    // if (userKey === 'project') {
    //   sortingValue = 'project.name';
    // }
    // if (userKey === 'recruiter') {
    //   sortingValue = 'recruiter.name';
    // }
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
      ].includes(userKey)
    ) {
      sortingValue = _ => _[userKey] || null;
    }
    // if (isMongoId(userKey)) {
    //   sortingValue = `customFields.${userKey}`;
    // }
    sortingToggler(userKey, sortingValue);
  };

  const [openColsSettins, setOpenColsSettings] = useState(false);

  const allCols = ['client.name', ...activeCols];

  return (
    <TableWrapper>
      <ListTable
        columns={allCols}
        className="users-table"
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
        {pageItems.map((user: IClient) => (
          <ProfileRow
            key={user._id}
            data={user}
            cols={activeCols}
          />
        ))}
        {!pageItems.length && (
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
      <SettingsTable
        open={openColsSettins}
        onClose={() => void setOpenColsSettings(false)}
        activeCols={activeCols}
        setActiveCols={setActiveCols}
      />
    </TableWrapper>
  );
};

export default memo(Table);
