import React, { useState } from 'react';
import { Autocomplete as AutocompleteMaterial } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import Input from '../Input';

export type AutocompleteProps = {
  defaultOpen?: boolean;
  loading?: boolean;
  options: any[];
  label: string;
  labelKey?: string;
  getOptionLabel?(item: any): string;
  multiple?: boolean;
  limitTags?: number;
  style?: React.CSSProperties;
  onChange?(value: any | any[] | null): void;
  value?: any;
  defaultValue?: any;
  className?: string;
  error?: boolean;
}

const AutoComplete = ({
  label, loading, labelKey, onChange, defaultOpen, value, getOptionLabel, error, ...rest
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AutocompleteMaterial
      style={{ minWidth: 223 }}
      getOptionLabel={option => labelKey ? option[labelKey] : getOptionLabel?.(option)}
      onChange={(e, newValue) => void onChange?.(newValue)}
      value={value}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderInput={(params) => (
        <Input
          {...params}
          label={label}
          error={error}
          InputProps={{
            ...params.InputProps,
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
      {...rest}
    />
  );
};

export default AutoComplete;
