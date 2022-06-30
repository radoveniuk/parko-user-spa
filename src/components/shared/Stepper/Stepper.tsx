import React from 'react';
import { Step, StepLabel, Stepper as StepperMaterial } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  steps: string[];
  activeStep: number;
}

const Stepper = ({ steps, activeStep }: Props) => {
  const { t } = useTranslation();
  return (
    <StepperMaterial activeStep={activeStep}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{t(label)}</StepLabel>
        </Step>
      ))}
    </StepperMaterial>
  );
};
export default Stepper;
