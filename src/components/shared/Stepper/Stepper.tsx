import React from 'react';
import { Step, StepLabel, Stepper as StepperMaterial } from '@mui/material';

type Props = {
  steps: string[];
  activeStep: number;
}

const Stepper = ({ steps, activeStep }: Props) => (
  <StepperMaterial activeStep={activeStep}>
    {steps.map((label) => {
      const stepProps: { completed?: boolean } = {};
      const labelProps: {
            optional?: React.ReactNode;
          } = {};
      return (
        <Step key={label} {...stepProps}>
          <StepLabel {...labelProps}>{label}</StepLabel>
        </Step>
      );
    })}
  </StepperMaterial>
);

export default Stepper;
