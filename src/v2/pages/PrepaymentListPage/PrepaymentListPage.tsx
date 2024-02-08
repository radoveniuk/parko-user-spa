import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { SearchIcon } from 'components/icons';
import { FilterAutocomplete, FiltersProvider, useFilters } from 'components/shared/Filters';
import { IUser } from 'interfaces/users.interface';

import HeaderTable from './components/HeaderTable';
import MobileClientCard from './components/MobilePrepaymentCard';
import Table from './components/Table';
import { FilterTableWrapper, ProfileListPageWrapper } from './styles';

const DEFAULT_COLS = [
  'prepayment.user',
  'user.project',
  'user.status',
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.status',
  'prepayment.paymentDate',
  '',
  '',
];

const ClientListPageRender = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.prepayments'));

  const { filtersState } = useFilters();

  // table content
  const { data = [], remove } = useGetPrepayments();

  useEffect(() => () => { remove(); }, [remove]);

  const filteredPrepayments = useMemo(() => {
    let updatedList = [...data];
    if (filtersState?.users) {
      updatedList = updatedList.filter((item) => filtersState?.users.includes(item.user._id));
    }
    return updatedList;
  }, [data, filtersState?.users]);

  const usersFilter = useMemo(() => {
    const usersList: IUser[] = [];
    data.forEach((item) => {
      if (!usersList.some(user => user._id === item.user._id)) {
        usersList.push(item.user);
      }
    });
    return usersList;
  }, [data]);

  return (
    <ProfileListPageWrapper>
      <div className="container-table">
        <HeaderTable
          data={filteredPrepayments}
          activeCols={DEFAULT_COLS}
        />
        <FilterTableWrapper>
          <FilterAutocomplete
            multiple
            options={usersFilter}
            getOptionLabel={(user) => `${user.name} ${user.surname}`}
            filterKey="users"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            placeholder={t('search')}
          />
        </FilterTableWrapper>
        <div className="mobile-list">
          {filteredPrepayments.map((prepayment) => (
            <MobileClientCard
              key={prepayment._id}
              prepayment={prepayment}
            />
          ))}
        </div>
        <Table
          activeCols={DEFAULT_COLS}
          data={filteredPrepayments}
        />
      </div>
    </ProfileListPageWrapper>
  );
};

export default function ClientListPage () {
  return (
    <FiltersProvider>
      <ClientListPageRender />
    </FiltersProvider>
  );
};
