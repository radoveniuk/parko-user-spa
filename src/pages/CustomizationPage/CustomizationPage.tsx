import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';

import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';

import CustomFields from './CustomFields';
import Dictionaries from './Dictionaries';
import DocsTemplates from './DocsTemplates';

const CustomizationPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.customization'));

  return (
    <>
      <TabsContainer>
        <Tabs>
          <Tab label={t('navbar.profiles')} />
          <Tab label={t('navbar.projects')} />
          <Tab label={t('dictionaries')} />
          <Tab label={t('navbar.docsTemplates')} />
        </Tabs>
        <TabPanel index={0}>
          <CustomFields entity="user" />
        </TabPanel>
        <TabPanel index={1}>
          <CustomFields entity="project" />
        </TabPanel>
        <TabPanel index={2}>
          <Dictionaries />
        </TabPanel>
        <TabPanel index={3}>
          <DocsTemplates />
        </TabPanel>
      </TabsContainer>
    </>
  );
};

export default CustomizationPage;
