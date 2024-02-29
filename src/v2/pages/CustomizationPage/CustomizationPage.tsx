import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import DocsTemplates from './DocsTemplates';
import { PageWrapper } from './styles';

const CustomizationPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.customization'));

  return (
    <PageWrapper>
      <TabsContainer>
        <Tabs>
          <Tab label={t('navbar.docsTemplates')} />
        </Tabs>
        <TabPanel index={0}>
          <DocsTemplates />
        </TabPanel>
      </TabsContainer>
    </PageWrapper>
  );
};

export default CustomizationPage;
