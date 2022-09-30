import React, { forwardRef, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { DateTime } from 'luxon';

const dateRegex = /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/;

interface NumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const DateFormat = forwardRef<NumberFormat<string>, NumberFormatProps>(
  function NumberFormatCustom (props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.formattedValue,
            },
          });
        }}
        format="##.##.####"
        mask={['_', '_', '_', '_', '_', '_', '_', '_']}
      />
    );
  },
);

type Props = {
  value?: string | null;
  onChange(v: string, isValid?: boolean): void;
  label: string;
}

const DatePicker = ({ value: defaultValue, onChange, label }: Props) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (defaultValue) {
      const isIso = !DateTime.fromISO(defaultValue).invalidReason;
      if (isIso) {
        setValue(DateTime.fromISO(defaultValue).toFormat('dd.MM.yyyy'));
      }
      const isFormatted = !DateTime.fromFormat(defaultValue, 'dd.MM.yyyy').invalidReason;
      if (isFormatted) {
        setValue(defaultValue);
      }
    } else {
      setValue('');
    }
  }, [defaultValue]);

  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        const isValid = dateRegex.test(e.target.value);
        onChange(
          isValid ? DateTime.fromFormat(e.target.value, 'dd.MM.yyyy').toISODate() : '',
          isValid || e.target.value === '',
        );
      }}
      placeholder="DD.MM.YYYY"
      InputProps={{ inputComponent: DateFormat as any }}
      error={!!value && !dateRegex.test(value)}
    />
  );
};

export default DatePicker;

export const isValidDate = (v: string) => dateRegex.test(v);
