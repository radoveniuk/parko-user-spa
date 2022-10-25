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
          <Tab label={t('paycheck.upload')} />
          <Tab label={t('paycheck.uploaded')} />
        </Tabs>
        <TabPanel index={0}>
          <UploadArea />
        </TabPanel>
        <TabPanel index={1}>
          <UploadedPaychecks />
        </TabPanel>
      </TabsContainer>
    </Page>
  );
};

export default PaychecksUploadPage;
