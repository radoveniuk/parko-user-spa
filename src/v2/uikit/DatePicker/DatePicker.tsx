import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTime } from 'luxon';

import { CalendarIcon } from 'components/icons';

import { FieldWrapper } from './styles';

const dateRegex = /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/;

export type Props = {
  defaultValue?: string | null;
  onChange(v: string, isValid?: boolean): void;
  label: string;
  className?:string;
  error?: boolean;
  minDate?: string;
  maxDate?: string;
  openTo?: DateView;
  views?: DateView[];
}

const DatePicker = ({ defaultValue, onChange, label, className, error, minDate, maxDate, openTo, views }: Props) => {
  const { i18n } = useTranslation();

  const datetimeDefaultValue = useMemo(() => {
    if (defaultValue) {
      const isIso = !DateTime.fromISO(defaultValue).invalidReason;
      if (isIso) {
        return DateTime.fromISO(defaultValue);
      }
    } else {
      return null;
    }
  }, [defaultValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={i18n.language}>
      <DesktopDatePicker
        className={className}
        label={label}
        format="dd.MM.yyyy"
        defaultValue={datetimeDefaultValue}
        onChange={(luxonValue: DateTime | null) => {
          onChange(
            luxonValue?.isValid ? luxonValue?.toISODate() || '' : '',
            luxonValue?.isValid,
          );
        }}
        slots={{
          textField: (params) => (
            <FieldWrapper>
              <div className="label">{label}</div>
              <TextField {...params} label={undefined} error={error}/>
            </FieldWrapper>
          ),
          openPickerIcon: CalendarIcon,
        }}
        minDate={minDate ? DateTime.fromISO(minDate) : undefined}
        maxDate={maxDate ? DateTime.fromISO(maxDate) : undefined}
        openTo={openTo || 'day'}
        views={views}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;

export const isValidDate = (v: string) => dateRegex.test(v);
