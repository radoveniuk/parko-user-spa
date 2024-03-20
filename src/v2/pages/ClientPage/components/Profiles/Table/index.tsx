import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MobileUserCard from 'v2/components/MobileUserCard';
import { ColumnsConfig } from 'v2/components/UsersTable';
import IconButton from 'v2/uikit/IconButton';
import Pagination from 'v2/uikit/Pagination';

import { ArrowUpIcon, SettingsIcon } from 'components/icons';
import ListTable from 'components/shared/ListTable';
import { isMongoId } from 'helpers/regex';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import { Path } from 'interfaces/base.types';
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';
import { IUser } from 'interfaces/users.interface';

import ProfileRow from '../ProfileRow';

import { TableWrapper } from './styles';

const STATIC_COLS = ['', 'user.name', 'user.employmentStatus'];

type TTable = {
  activeCols: string[];
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>;
  data: (IUser & {employmentStatus: string})[];
  customFields: ICustomFormFieldSectionBinding<true>[];
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

  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const { pageItems, paginationConfig } = usePaginatedList(sortedData, { rowsPerPage });

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

  const [openColsSettins, setOpenColsSettings] = useState(false);

  const allCols = [...STATIC_COLS, ...activeCols];

  return (
    <TableWrapper>
      <div className="mobile-list">
        {sortedData.map((user) => (
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
        ))}
      </div>
      <ListTable
        columns={[...allCols, '']}
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
                  : customFields.find((customField: any) => customField._id === col)?.field.names[
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
                <IconButton onClick={() => void setOpenColsSettings((prev) => !prev)}>
                  <SettingsIcon />
                </IconButton>
              </div>
            );
          }
        }}
      >
        {pageItems.map((user) => (
          <ProfileRow
            key={user._id}
            data={user}
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
