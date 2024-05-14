import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import Movements from './Movements';
import Properties from './Properties';
import { PageWrapper } from './styles';

const StockPage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.stock'));

  return (
    <PageWrapper>
      <TabsContainer>
        <Tabs>
          <Tab label={t('stock.movements')} />
          <Tab label={t('stock.properties')} />
        </Tabs>
        <TabPanel index={0}>
          <Movements />
        </TabPanel>
        <TabPanel index={1} hiddenRender={false}>
          <Properties />
        </TabPanel>
      </TabsContainer>
    </PageWrapper>
  );
};

export default StockPage;
