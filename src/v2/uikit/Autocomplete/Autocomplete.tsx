import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';

import { DropdownIcon } from 'components/icons';

import Input from '../Input';

import { DropdownIconWrapper, StyledAutocomplete } from './styles';

type FieldTheme = 'white' | 'gray';

export type AutocompleteProps = {
  defaultOpen?: boolean;
  loading?: boolean;
  options: any[];
  label?: string;
  labelKey?: string;
  valueKey?: string;
  getOptionLabel?(item: any): string | ReactNode;
  multiple?: boolean;
  limitTags?: number;
  style?: React.CSSProperties;
  onChange?(value: any | any[] | null): void;
  value?: any;
  defaultValue?: any;
  className?: string;
  error?: boolean;
  disableCloseOnSelect?: boolean;
  autoComplete?: boolean;
  prefixIcon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  maxWidth?: number;
  theme?: FieldTheme;
  required?: boolean;
}

const AutoComplete = ({
  label, loading, labelKey, onChange, defaultOpen, value,
  getOptionLabel, error, prefixIcon, placeholder, disabled, maxWidth,
  valueKey = '_id', theme = 'white', required,
  ...rest
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <StyledAutocomplete
      theme={theme}
      style={{ minWidth: 223, maxWidth }}
      renderOption={(props, option: any) => (
        <li {...props} key={option[valueKey]}>
          {labelKey ? option[labelKey] : getOptionLabel?.(option)}
        </li>
      )}
      getOptionLabel={(option: any) => labelKey ? option[labelKey] : getOptionLabel?.(option)}
      onChange={(e, newValue) => void onChange?.(newValue)}
      value={value}
      isOptionEqualToValue={(option: any, value: any) => option[valueKey] === value[valueKey]}
      disabled={disabled}
      limitTags={1}
      popupIcon={<DropdownIconWrapper><DropdownIcon size={12} color="#131313" /></DropdownIconWrapper>}
      noOptionsText={t('noOptions')}
      renderInput={(params) => (
        <Input
          {...params}
          label={label}
          theme={theme}
          error={error}
          placeholder={placeholder}
          required={required}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {prefixIcon}
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      open={defaultOpen || open}
      onOpen={() => void setOpen(true)}
      onClose={() => void setOpen(false)}
      disableCloseOnSelect={rest.disableCloseOnSelect !== undefined ? rest.disableCloseOnSelect : !!rest.multiple}
      {...rest}
    />
  );
};

export default AutoComplete;
