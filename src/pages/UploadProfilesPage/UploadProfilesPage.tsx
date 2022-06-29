import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';

import UploadProfilesProvider from './UploadProfilesContext';
import FileUploading from './steps/FileUploading';
import ResultsPreview from './steps/ResultsPreview/ResultsPreview';

import Button from 'components/shared/Button';
import Stepper from 'components/shared/Stepper';

const steps = ['fileUploading', 'resultsPreview'];

const UploadProfilesPageRender = () => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <Page title={t('user.uploadFromFile')}>
      <PageTitle>{t('user.uploadFromFile')}</PageTitle>
      <Stepper activeStep={activeStep} steps={steps} />
      {activeStep !== steps.length - 1 && <Button onClick={handleNext}>Next</Button>}
      {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}

      {activeStep === 0 && <FileUploading />}
      {activeStep === 1 && <ResultsPreview />}
    </Page>
  );
};

export default function UploadProfilesPage () {
  return <UploadProfilesProvider>
    <UploadProfilesPageRender />
  </UploadProfilesProvider>;
};
