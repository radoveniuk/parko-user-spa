import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

const ProjectPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('project.title')}>
      <PageTitle>{t('project.title')}</PageTitle>
    </Page>
  );
};

export default ProjectPage;
