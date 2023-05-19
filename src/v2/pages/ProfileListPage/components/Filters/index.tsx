import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Stack,
} from 'v2/uikit';

import { FilterCheckboxGroup } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import FilterOrganization from './componenst/FilterOrganization';
import { FilterWrapper } from './styles';

const Filters = () => {
  const { t } = useTranslation();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  return (
    <FilterWrapper>
      <Stack gap="10px">
        <Paper elevation={0} headerTitle={t('profilesPage.status')}>
          <FilterCheckboxGroup
            options={translatedStatuses}
            filterKey="statuses"
          />
        </Paper>
        <Paper elevation={0} headerTitle={t('profilesPage.organization')}>
          <FilterOrganization />
        </Paper>
      </Stack>
    </FilterWrapper>
  );
};

export default Filters;
