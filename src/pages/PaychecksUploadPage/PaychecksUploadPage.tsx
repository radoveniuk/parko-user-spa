import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';

import UploadArea from './UploadArea';
import UploadedPaychecks from './UploadedPaychecks';

const PaychecksUploadPage = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('paychecksUpload')}>
      <PageTitle>{t('paychecksUpload')}</PageTitle>
      <TabsContainer>
        <Tabs>
          <Tab label={t('paycheck.uploaded')} />
          <Tab label={t('paycheck.upload')} />
        </Tabs>
        <TabPanel index={0}>
          <UploadedPaychecks />
        </TabPanel>
        <TabPanel index={1}>
          <UploadArea />
        </TabPanel>
      </TabsContainer>
    </Page>
  );
};

export default PaychecksUploadPage;
