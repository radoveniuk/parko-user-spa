import React from 'react';
import { useTranslation } from 'react-i18next';
import { Orientation as StepperOrientation, Step, StepLabel, Stepper as StepperMaterial } from '@mui/material';

type Props = {
  steps: string[];
  activeStep?: number;
  orientation?: StepperOrientation;
  getStepComponent?(step: string): string | React.ReactNode;
}

const Stepper = ({ steps, activeStep, getStepComponent, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <StepperMaterial activeStep={activeStep} {...rest}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{getStepComponent?.(label) || t(label)}</StepLabel>
        </Step>
      ))}
    </StepperMaterial>
  );
};
export default Stepper;
