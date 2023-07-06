import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Stack,
} from 'v2/uikit';

import { ArrowBackIcon } from 'components/icons';
import { FilterCheckboxGroup } from 'components/shared/Filters';
import { useOpenFilterDrawler } from 'components/shared/Filters/useFilters';
import { USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

import FilterOrganization from './componenst/FilterOrganization';
import { ContainerWrapper, FilterWrapper } from './styles';

const Filters = () => {
  const { t } = useTranslation();
  const { openDrawerFilter, setOpenDrawerFilter } = useOpenFilterDrawler();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const handleOpen = useCallback(() => {
    setOpenDrawerFilter((prev) => !prev);
  }, [setOpenDrawerFilter]);

  return (
    <ContainerWrapper className="filters">
      <button onClick={handleOpen} className={`btn-open ${openDrawerFilter ? 'active' : ''}`}><ArrowBackIcon size={20}/></button>
      <FilterWrapper className={`${openDrawerFilter ? 'active' : ''}`}>
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
    </ContainerWrapper>
  );
};

export default Filters;
