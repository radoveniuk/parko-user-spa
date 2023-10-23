import React, { memo } from 'react';

import Button from '../Button';

import { ButtonGroupWrapper } from './styles';

export type ButtonGroupOption = {
  value: string;
  label: string;
};

export type ButtonGroupProps = {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
};

const ButtonGroup = ({ onChange, value, options }: ButtonGroupProps) => (
  <ButtonGroupWrapper>
    {options.map(option => (
      <Button
        key={option.value}
        onClick={() => void onChange(option.value)}
        className={option.value === value ? 'selected' : ''}
        variant="outlined"
      >
        {option.label}
      </Button>
    ))}
  </ButtonGroupWrapper>
);

export default memo(ButtonGroup);
