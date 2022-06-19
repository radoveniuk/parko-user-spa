import React, { useState } from 'react';

import { Autocomplete as AutocompleteMaterial } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Input from '../Input';

export type AutocompleteProps = {
  defaultOpen?: boolean;
  loading?: boolean;
  options: any[];
  label: string;
  labelKey: string;
  multiple?: boolean;
  limitTags?: number;
  style?: React.CSSProperties;
  onChange?(value: any | any[] | null): void;
  value?: any;
}

const AutoComplete = ({
  label, loading, labelKey, onChange, defaultOpen, value, ...rest
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AutocompleteMaterial
      {...rest}
      getOptionLabel={option => option[labelKey]}
      onChange={(e, newValue) => void onChange?.(newValue)}
      value={value}
      renderInput={(params) => (
        <Input
          {...params}
          label={label}
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
    />
  );
};

export default AutoComplete;
