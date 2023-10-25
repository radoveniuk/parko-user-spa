import React, { useState } from 'react';
import AutocompleteMaterial from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { DropdownIcon } from 'components/icons';

import Input from '../Input';

import { DropdownIconWrapper } from './styles';

export type AutocompleteProps = {
  defaultOpen?: boolean;
  loading?: boolean;
  options: any[];
  label?: string;
  labelKey?: string;
  valueKey?: string;
  getOptionLabel?(item: any): string;
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
}

const AutoComplete = ({
  label, loading, labelKey, onChange, defaultOpen, value,
  getOptionLabel, error, prefixIcon, placeholder, disabled, maxWidth,
  valueKey = '_id',
  ...rest
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AutocompleteMaterial
      style={{ minWidth: 223, maxWidth }}
      renderOption={(props, option) => (
        <li {...props} key={option[valueKey]}>
          {labelKey ? option[labelKey] : getOptionLabel?.(option)}
        </li>
      )}
      getOptionLabel={option => labelKey ? option[labelKey] : getOptionLabel?.(option)}
      onChange={(e, newValue) => void onChange?.(newValue)}
      value={value}
      isOptionEqualToValue={(option, value) => option[valueKey] === value[valueKey]}
      disabled={disabled}
      limitTags={1}
      popupIcon={<DropdownIconWrapper><DropdownIcon size={16} color="rgba(0, 0, 0, 0.54)" /></DropdownIconWrapper>}
      renderInput={(params) => (
        <Input
          {...params}
          label={label}
          error={error}
          placeholder={placeholder}
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
