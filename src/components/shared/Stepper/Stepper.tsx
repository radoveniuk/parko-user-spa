import React from 'react';
import { useTranslation } from 'react-i18next';
import { Orientation as StepperOrientation, Step, StepLabel, Stepper as StepperMaterial } from '@mui/material';

type Props = {
  steps: string[];
  activeStep?: number;
  orientation?: StepperOrientation;
}

const Stepper = ({ steps, activeStep, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <StepperMaterial activeStep={activeStep} {...rest}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{t(label)}</StepLabel>
        </Step>
      ))}
    </StepperMaterial>
  );
};
export default Stepper;
