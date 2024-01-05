import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ClientFormDialog from 'v2/components/ClientFormDialog';
import { Button, Stack } from 'v2/uikit';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';
import IconButton from 'v2/uikit/IconButton';

import { useCreateClientMutation } from 'api/mutations/clientMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { FilterIcon, PlusIcon } from 'components/icons';
import { FilterAutocomplete, useFilters } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import { FiltersWrapper, HeaderWrapper } from './styles';

const HeaderTable = ({ data }: any) => {
  const { t } = useTranslation();

  // filters
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  const [openNewClient, setOpenNewClient] = useState(false);
  const createClientMutation = useCreateClientMutation();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const createNewClientHndler = (data: Partial<IClient>) => {
    setOpenNewClient(false);
    const queryKey = ['clients', JSON.stringify(filtersState)];
    queryClient.setQueryData(queryKey, [data, ...(queryClient.getQueryData(queryKey) as IUser[])]);
    createClientMutation.mutateAsync(data).then((res) => {
      const [, ...oldItems] = queryClient.getQueryData(queryKey) as IUser[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('navbar.clients')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <IconButton className="small-btn" onClick={() => void setOpenMobileFilters(true)}><FilterIcon size={25} /></IconButton>
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewClient(true)}><PlusIcon size={25} /></IconButton>
            <Button className="big-btn" onClick={() => void setOpenNewClient(true)}>
              {t('client.new')}
            </Button>
          </div>
        </Stack>
        <DialogFullscreen title={t('filters')} open={openMobileFilters} onClose={() => void setOpenMobileFilters(false)}>
          <FiltersWrapper>
            <FilterAutocomplete
              multiple
              filterKey="projects"
              label={t('user.project')}
              options={projects}
              labelKey="name"
            />
            <FilterAutocomplete
              multiple
              filterKey="statuses"
              label={t('user.status')}
              options={translatedStatuses}
              labelKey="label"
            />
            <Button onClick={() => void setOpenMobileFilters(false)} variant="contained" className="apply-filter-btn">{t('apply')}</Button>
          </FiltersWrapper>
        </DialogFullscreen>
      </HeaderWrapper>
      <ClientFormDialog
        open={openNewClient}
        onClose={() => void setOpenNewClient(false)}
        onSave={createNewClientHndler}
      />
    </>
  );
};

export default memo(HeaderTable);
