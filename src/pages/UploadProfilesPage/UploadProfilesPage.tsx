import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';
import Button from 'components/shared/Button';
import Stepper from 'components/shared/Stepper';

import UploadProfilesProvider, { useRelativeFields } from './UploadProfilesContext';
import FileUploading from './steps/FileUploading';
import ResultsPreview from './steps/ResultPreview';
import { StepperWrapper } from './styles';
import { isEmpty } from 'lodash-es';

const steps = ['userUpload.fileUploading', 'userUpload.resultPreview'];

const StepContent = ({ display, children }: { display: boolean, children: React.ReactNode }) => (
  <div style={{ display: display ? 'block' : 'none' }}>{children}</div>
);

const UploadProfilesPageRender = () => {
  const { t } = useTranslation();
  const [relativeFields] = useRelativeFields();

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => void setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => void setActiveStep((prevActiveStep) => prevActiveStep - 1);

  return (
    <Page title={t('userUpload.title')}>
      <PageTitle>{t('userUpload.title')}</PageTitle>
      <StepperWrapper>
        <Stepper activeStep={activeStep} steps={steps} />
        {activeStep !== 0 && <Button onClick={handleBack}>{t('back')}</Button>}
        {activeStep === 0 && <Button onClick={handleNext} disabled={isEmpty(relativeFields)}>{t('next')}</Button>}
        {activeStep === steps.length - 1 && <Button onClick={() => {}} color="success">{t('user.upload')}</Button>}
      </StepperWrapper>
      <StepContent display={activeStep === 0}><FileUploading /></StepContent>
      <StepContent display={activeStep === 1}><ResultsPreview /></StepContent>
    </Page>
  );
};

export default function UploadProfilesPage () {
  return (
    <UploadProfilesProvider>
      <UploadProfilesPageRender />
    </UploadProfilesProvider>
  );
};
