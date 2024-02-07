import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useCreatePaycheckMutation } from 'api/mutations/paycheckMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import Paychecks from 'components/complex/Paychecks';
import { PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import { FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiltersButton, FilterDate } from 'components/shared/Filters/Filters';
import { PageActions } from 'components/shared/PageComponents';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPaycheck } from 'interfaces/paycheck.interface';

import UploadDialog from '../UploadDialog';

const UploadedPaychecksRender = () => {
  const { filtersState } = useFilters();
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();
  const { data: users = [] } = useGetUserListForFilter();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const [openUpload, setOpenUpload] = useState(false);
  const createPaycheckMutation = useCreatePaycheckMutation();
  const queryClient = useQueryClient();

  const createPaycheck = async (data: IPaycheck) => {
    const result = await createPaycheckMutation.mutateAsync(data);
    const oldPaychecks: IPaycheck[] = queryClient.getQueryData(['paychecks', JSON.stringify(filtersState)]) || [];
    queryClient.setQueryData(['paychecks', JSON.stringify(filtersState)], [result, ...oldPaychecks]);
    setOpenUpload(false);
  };

  return (
    <>
      <PageActions>
        <Button onClick={() => void setOpenUpload(true)}><PlusIcon size={20} />{t('paycheck.new')}</Button>
      </PageActions>
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
        <ClearFiltersButton />
      </FiltersBar>
      <Paychecks filter={filtersState} />
      {!!openUpload && (
        <UploadDialog
          {...(typeof openUpload === 'object' && { defaultData: openUpload })}
          open={!!openUpload}
          onClose={() => void setOpenUpload(false)}
          submit={createPaycheck}
        />
      )}
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
