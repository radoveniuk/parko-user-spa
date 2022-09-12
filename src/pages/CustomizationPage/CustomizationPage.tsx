import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';

import CustomFields from './CustomFields';

const CustomizationPage = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('navbar.customization')}>
      <PageTitle>{t('navbar.customization')}</PageTitle>
      <TabsContainer>
        <Tabs>
          <Tab label={t('navbar.profiles')} />
          <Tab label={t('navbar.projects')} />
        </Tabs>
        <TabPanel index={0}>
          <CustomFields entity="user" />
        </TabPanel>
        <TabPanel index={1}>
        </TabPanel>
      </TabsContainer>
    </Page>
  );
};

export default CustomizationPage;
