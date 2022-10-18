import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import Paychecks from 'components/complex/Paychecks';
import { FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiLtersButton, FilterDate } from 'components/shared/Filters/Filters';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

const UploadedPaychecksRender = () => {
  const { filtersState } = useFilters();
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();
  const { data: users = [] } = useGetUserListForFilter();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  return (
    <>
      <FiltersBar>
        <FilterAutocomplete
          multiple
          options={users}
          getOptionLabel={(user) => `${user.name} ${user.surname}`}
          filterKey="users"
          label={t('search')}
        />
        <FilterAutocomplete
          multiple
          filterKey="projects"
          label={t('user.project')}
          options={projects}
          labelKey="name"
        />
        <FilterAutocomplete
          multiple
          filterKey="userStatuses"
          label={t('user.status')}
          options={translatedStatuses}
          labelKey="label"
        />
        <FilterDate filterKey="firstDate" label={t('firstDate')} />
        <FilterDate filterKey="lastDate" label={t('lastDate')} />
        <ClearFiLtersButton />
      </FiltersBar>
      <Paychecks filter={filtersState} />
    </>
  );
};

export default function UploadedPaychecks () {
  return (
    <FiltersProvider>
      <UploadedPaychecksRender />
    </FiltersProvider>
  );
}
