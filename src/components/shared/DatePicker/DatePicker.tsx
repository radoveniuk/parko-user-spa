import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTime } from 'luxon';

const dateRegex = /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/;

export type Props = {
  value?: string | null;
  onChange(v: string, isValid?: boolean): void;
  label: string;
  className?:string;
  error?: boolean;
  minDate?: string;
  maxDate?: string;
}

const DatePicker = ({ value: defaultValue, onChange, label, className, error, minDate, maxDate }: Props) => {
  const [value, setValue] = useState<DateTime | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (defaultValue) {
      const isIso = !DateTime.fromISO(defaultValue).invalidReason;
      if (isIso) {
        setValue(DateTime.fromISO(defaultValue));
      }
    } else {
      setValue(null);
    }
  }, [defaultValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={i18n.language}>
      <DesktopDatePicker
        className={className}
        label={label}
        inputFormat="dd.MM.yyyy"
        value={value}
        onChange={(luxonValue: DateTime | null) => {
          setValue(luxonValue);
          onChange(
            luxonValue?.isValid ? luxonValue?.toISODate() || '' : '',
            luxonValue?.isValid,
          );
        }}
        renderInput={(params) => <TextField {...params} error={error}/>}
        minDate={minDate ? DateTime.fromISO(minDate) : undefined}
        maxDate={maxDate ? DateTime.fromISO(maxDate) : undefined}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;

export const isValidDate = (v: string) => dateRegex.test(v);
