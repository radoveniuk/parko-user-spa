import React, { memo } from 'react';

import Button from '../Button';

import { ButtonGroupWrapper } from './styles';

export type ButtonGroupOption = {
  value: string;
  label: string;
};

export type ButtonGroupProps = {
  options: ButtonGroupOption[];
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const ButtonGroup = ({ onChange, value, options, disabled }: ButtonGroupProps) => (
  <ButtonGroupWrapper>
    {options.map(option => (
      <Button
        key={option.value}
        onClick={() => void onChange?.(option.value)}
        className={option.value === value ? 'selected' : ''}
        variant="outlined"
        disabled={disabled}
      >
        {option.label}
      </Button>
    ))}
  </ButtonGroupWrapper>
);

export default memo(ButtonGroup);
