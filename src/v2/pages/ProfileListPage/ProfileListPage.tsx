import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import { Stack } from 'v2/uikit';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { AiOutlineSearchIcon } from 'components/icons';
import { ClearFiLtersButton, FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { useOpenFilterDrawler } from 'components/shared/Filters/useFilters';
import { PageTitleV2 } from 'components/shared/Page/styles';
import useLocalStorageState from 'hooks/useLocalStorageState';
import { IUser } from 'interfaces/users.interface';

import Filters from './components/Filters';
import HeaderTable from './components/HeaderTable';
import SettingsTable from './components/SettingsTable';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'user.birthDate',
  'user.project',
  'user.status',
];

const ProfileListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('prepaymentsList'));

  const { debouncedFiltersState } = useFilters();

  // table content
  const { data = [], refetch, remove } = useGetUserList(debouncedFiltersState, { enabled: false });

  // filters
  const { data: usersFilter = [] } = useGetUserListForFilter();

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState('profilesTableCols');
  const [activeCols, setActiveCols] = useState<string[]>(storedColsSettings ? JSON.parse(storedColsSettings).cols : DEFAULT_COLS);

  // custom cols
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => { remove(); };
  }, [debouncedFiltersState, refetch, remove]);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: activeCols }));
  }, [activeCols, setStoredColsSettings]);

  return (
    <ProfileListPageWrapper cols={activeCols.length + 1}>
      <PageTitleV2>{t('profileList')}</PageTitleV2>
      <Stack direction="row">
        <Filters />
        <div className="container-table">
          <HeaderTable
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            setOpenPrintDialog={setOpenPrintDialog}
            data={data}
            activeCols={activeCols}
            customFields={customFields}
          />
          <FilterTableWrapper>
            <FilterAutocomplete
              multiple
              options={usersFilter}
              getOptionLabel={user => `${user.name} ${user.surname}`}
              filterKey="ids"
              label={t('search')}
              prefixIcon={<AiOutlineSearchIcon className="search-icon"/>}
              className="filter-name"
              limitTags={1}
            />
            <ClearFiLtersButton />
            <div className="table-settings-wrapper">
              <SettingsTable
                customFields={customFields}
                activeCols={activeCols}
                setActiveCols={setActiveCols}
              />
            </div>
          </FilterTableWrapper>
          <Table
            activeCols={activeCols}
            data={data.slice(0, 3)}
            customFields={customFields}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
          />
        </div>
      </Stack>
      {openPrintDialog && (
        <PrintDocDialog
          users={selectedItems}
          open={openPrintDialog}
          onClose={() => void setOpenPrintDialog(false)}
        />
      )}
    </ProfileListPageWrapper>
  );
};

export default function ProfileListPage () {
  return (
    <FiltersProvider>
      <ProfileListPageRender />
    </FiltersProvider>
  );
};
