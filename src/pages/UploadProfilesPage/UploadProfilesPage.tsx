import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { invert } from 'lodash-es';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Button from 'v2/uikit/Button';

import { useUploadUsersMutation } from 'api/mutations/userMutation';
import Stepper from 'components/shared/Stepper';
import { isMongoId } from 'helpers/regex';
import { AnyObject } from 'interfaces/base.types';

import FileUploading from './steps/FileUploading';
import Result from './steps/Result';
import ResultsPreview from './steps/ResultPreview';
import { StepperWrapper } from './styles';
import UploadProfilesProvider, { useRelativeFields, useResult } from './UploadProfilesContext';

const steps = ['userUpload.fileUploading', 'userUpload.resultPreview', 'userUpload.finish'];

const StepContent = ({ display, children }: { display: boolean, children: React.ReactNode }) => (
  <div style={{ display: display ? 'block' : 'none' }}>{children}</div>
);

const UploadProfilesPageRender = () => {
  const { t } = useTranslation();
  const [relativeFields] = useRelativeFields();
  const usersResult = useResult();
  const uploadUsersMutation = useUploadUsersMutation();

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => void setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => void setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const uploadResult = () => {
    const dataToUpload = usersResult.map((oldItem) => {
      const item: AnyObject = { ...oldItem, customFields: {} };
      Object.keys(oldItem).forEach((oldKey) => {
        if (isMongoId(oldKey)) {
          item.customFields[oldKey] = item[oldKey];
          delete item[oldKey];
        }
      });
      return item;
    });

    uploadUsersMutation.mutateAsync(dataToUpload)
      .then((e) => {
        console.log(e);
        handleNext();
      });
  };

  const disableNextStep = !invert(relativeFields).email;
  useDocumentTitle(t('userUpload.title'));

  return (
    <>
      <StepperWrapper>
        <Stepper activeStep={activeStep} steps={steps} />
        {![0, 2].includes(activeStep) && <Button onClick={handleBack}>{t('back')}</Button>}
        {activeStep === 0 && <Button onClick={handleNext} disabled={disableNextStep}>{t('next')}</Button>}
        {activeStep === 1 && <Button onClick={uploadResult} color="success">{t('user.upload')}</Button>}
      </StepperWrapper>
      <StepContent display={activeStep === 0}><FileUploading /></StepContent>
      <StepContent display={activeStep === 1}><ResultsPreview /></StepContent>
      <StepContent display={activeStep === 2}><Result /></StepContent>
    </>
  );
};

export default function UploadProfilesPage () {
  return (
    <UploadProfilesProvider>
      <UploadProfilesPageRender />
    </UploadProfilesProvider>
  );
};
