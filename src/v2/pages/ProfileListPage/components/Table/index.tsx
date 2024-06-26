/* eslint-disable react/prop-types */
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { FixedSizeList } from 'react-window';
import { useFilters } from 'v2/components/Filters';
import MobileUserCard from 'v2/components/MobileUserCard';
import { ColumnsConfig } from 'v2/components/UsersTable';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';
import Skeleton from 'v2/uikit/Skeleton';

import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { ArrowUpIcon, FilterDownIcon, FilterUpIcon, SettingsIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { iterateMap } from 'helpers/iterateMap';
import { isMongoId } from 'helpers/regex';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import { Path } from 'interfaces/base.types';
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';
import { IUser } from 'interfaces/users.interface';

import { useFilterBarVisibility } from '../../contexts/FilterBarVisibilityContext';
import ProfileRow from '../ProfileRow';

import { TableWrapper } from './styles';

const STATIC_COLS = ['', 'user.name'];

type Props = {
  activeCols: string[];
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>;
  data: IUser[];
  customFields: ICustomFormFieldSectionBinding<true>[];
  setSelectedItems: React.Dispatch<React.SetStateAction<IUser[]>>;
  selectedItems: IUser[];
  isFetching?: boolean;
};

const Table = ({
  activeCols,
  setActiveCols,
  data,
  customFields,
  setSelectedItems,
  selectedItems,
  isFetching,
}: Props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { debouncedFiltersState } = useFilters();
  const [editingRow, setEditingRow] = useState<null | string>(null);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData);
  const updateUserMutation = useUpdateUserMutation();
  const { data: projects = [] } = useGetProjects();
  const [filterBarVisibility, setFilterBarVisibility] = useFilterBarVisibility();

  const toggleSorting = (userKey: string) => {
    let sortingValue = userKey as Path<IUser> | ((v: IUser) => any);
    console.log(userKey);

    if (userKey === 'client') {
      sortingValue = 'project.client.name';
    }
    if (userKey === 'project') {
      sortingValue = 'project.name';
    }
    if (userKey === 'recruiter') {
      sortingValue = 'recruiter.fullname';
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
      sortingValue = _ => _[userKey as keyof IUser] || null;
    }
    if (isMongoId(userKey)) {
      sortingValue = `customFields.${userKey}`;
    }
    sortingToggler(userKey, sortingValue);
  };

  const updateUser = (values: Partial<IUser>) => {
    if (values._id) {
      const recruiters = queryClient.getQueryData(['users-filter', JSON.stringify({ permissions: 'users:update' })]) as IUser[];
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

  const [openColsSettins, setOpenColsSettings] = useState(false);

  const allCols = [...STATIC_COLS, ...activeCols];

  return (
    <TableWrapper>
      <FixedSizeList
        className="mobile-list"
        height={window.innerHeight - 200}
        itemCount={sortedData.length}
        itemSize={150}
        width="100%"
      >
        {(props) => (
          <MobileUserCard
            {...props}
            user={sortedData[props.index]}
            selected={selectedItems.some(item => item._id === sortedData[props.index]._id)}
            onSelect={checked => {
              setSelectedItems(prev => {
                if (checked) {
                  return [...prev, sortedData[props.index]];
                }
                return prev.filter(item => item._id !== sortedData[props.index]._id);
              });
            }}
          />
        )}
      </FixedSizeList>
      <ListTable
        columns={[...allCols, '']}
        className={`users-table ${!filterBarVisibility ? 'expand' : ''}`}
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
                  : customFields.find((customField: any) => customField._id === col)?.field?.names[i18n.language]
                }
                <IconButton
                  className={
                    sorting?.key === (col.replace('user.', '') as keyof IUser)
                      ? `sort-btn active ${sorting.dir}`
                      : 'sort-btn'
                  }
                  aria-label={`sort ${col.replace('user.', '')}`}
                >
                  <ArrowUpIcon />
                </IconButton>
              </div>
            );
          }

          if (!col && index !== 0) {
            return (
              <>
                <div className="table-settings-wrapper">
                  <IconButton onClick={() => void setFilterBarVisibility((prev) => !prev)} aria-label="toggle filters">
                    {filterBarVisibility ? <FilterUpIcon /> : <FilterDownIcon />}
                  </IconButton>
                  <IconButton onClick={() => void setOpenColsSettings((prev) => !prev)} aria-label="toggle table columns">
                    <SettingsIcon />
                  </IconButton>
                </div>
              </>
            );
          }
        }}
      >
        {pageItems.map((user: IUser) => (
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
        open={openColsSettins}
        onClose={() => void setOpenColsSettings(false)}
        activeCols={activeCols}
        setActiveCols={setActiveCols}
        customFields={customFields}
      />
    </TableWrapper>
  );
};

export default memo(Table);
