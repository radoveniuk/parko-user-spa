import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

const ProjectListPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('projectList.title')}>
      <PageTitle>{t('projectList.title')}</PageTitle>
    </Page>
  );
};

export default ProjectListPage;
