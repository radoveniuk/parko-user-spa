import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTime } from 'luxon';

import { CalendarIcon } from 'components/icons';

import Input, { InputProps } from '../Input';

import { StyledDatePicker } from './styles';

type DateView = 'year' | 'month' | 'day';

const dateRegex = /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/;

export type Props = {
  defaultValue?: string | null;
  onChange(v: string, isValid?: boolean): void;
  label?: string;
  className?:string;
  error?: boolean;
  minDate?: string;
  maxDate?: string;
  format?: string;
  openTo?: DateView;
  views?: DateView[];
  disabled?: boolean;
  inputProps?: InputProps;
  onBlur?(e: any): void;
}

const DatePicker = ({
  defaultValue, onChange, label, className, error,
  minDate, maxDate, openTo, views, disabled,
  format = 'dd.MM.yyyy', onBlur, inputProps,
}: Props) => {
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
      <StyledDatePicker
        className={className}
        label={label}
        format={format}
        defaultValue={datetimeDefaultValue}
        disabled={disabled}
        slotProps={{ textField: { error, onBlur, ...inputProps } }}
        onChange={(luxonValue: DateTime | null) => {
          onChange(
            luxonValue?.isValid ? luxonValue?.toISO() || '' : '',
            luxonValue?.isValid,
          );
        }}
        slots={{
          textField: Input as any,
          openPickerIcon: (params) => <CalendarIcon size={16} {...params} />,
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
