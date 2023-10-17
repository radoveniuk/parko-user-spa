import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import Pagination from 'v2/uikit/Pagination';

import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { ArrowUpIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';
import IconButton from 'components/shared/IconButton';
import ListTable from 'components/shared/ListTable';
import { isMongoId } from 'helpers/regex';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import { Path } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';

import ProfileRow from '../ProfileRow';
import SettingsTable from '../SettingsTable';

import { TableWrapper } from './styles';

const STATIC_COLS = ['', 'user.name'];

type TTable = {
  activeCols: string[];
  setActiveCols: (v: string[]) => void;
  data: IUser[];
  customFields: any;
  setSelectedItems: React.Dispatch<React.SetStateAction<IUser[]>>;
  selectedItems: IUser[];
};
const Table = ({
  activeCols,
  setActiveCols,
  data,
  customFields,
  setSelectedItems,
  selectedItems,
}: TTable) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { debouncedFiltersState } = useFilters();

  const [rowsPerPage, setRowsPerPage] = useState(10); // TODO remove
  const [editingRow, setEditingRow] = useState<null | string>(null);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });
  const updateUserMutation = useUpdateUserMutation();
  const { data: projects = [] } = useGetProjects();
  const { data: recruiters = [] } = useGetUserList({ role: 'recruiter' });

  const toggleSorting = (userKey: keyof IUser) => {
    let sortingValue: Path<IUser> | ((v: IUser) => any) = userKey;
    if (userKey === 'project') {
      sortingValue = 'project.name';
    }
    if (userKey === 'recruiter') {
      sortingValue = 'recruiter.name';
    }
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
    if (isMongoId(userKey)) {
      sortingValue = `customFields.${userKey}`;
    }
    sortingToggler(userKey, sortingValue);
  };

  const updateUser = (values: Partial<IUser>) => {
    if (values._id) {
      updateUserMutation.mutate({ ...values, _id: values._id });
      const project = projects.find(item => item._id === values.project) || null;
      const recruiter = recruiters.find(item => item._id === values.recruiter) || null;

      queryClient.setQueryData(
        ['users', JSON.stringify(debouncedFiltersState)],
        data.map(userItem => {
          if (userItem._id === values._id) {
            return { ...userItem, ...values, project, recruiter };
          }
          return userItem;
        }),
      );
    }
  };

  return (
    <TableWrapper>
      <ListTable
        renderIf={!!sortedData.length}
        columns={[...STATIC_COLS, ...activeCols, '']}
        className="users-table"
        columnComponent={(col, index) => {
          if (col) {
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(col.replace('user.', '') as keyof IUser)}
              >
                {!isMongoId(col)
                  ? t(col)
                  : customFields.find((customField: any) => customField._id === col)?.names[
                    i18n.language
                  ]}
                <IconButton
                  className={
                    sorting?.key === (col.replace('user.', '') as keyof IUser)
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
                <SettingsTable
                  customFields={customFields}
                  activeCols={activeCols}
                  setActiveCols={setActiveCols}
                />
              </div>
            );
          }
        }}
      >
        {pageItems.map((user: any) => (
          <ProfileRow
            key={user._id}
            data={user}
            editingMode={editingRow === user._id}
            startEdit={() => void setEditingRow(user._id)}
            saveEdit={values => {
              setEditingRow(null);
              updateUser(values);
            }}
            cols={activeCols}
            selected={selectedItems.some(item => item._id === user._id)}
            onChangeSelect={checked => {
              setSelectedItems(prev => {
                if (checked) {
                  return [...prev, user];
                }
                return prev.filter(item => item._id !== user._id);
              });
            }}
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
