import * as React from 'react';

import { Autocomplete as AutocompleteMaterial } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Input from '../Input';

type Props = {
  open: boolean;
  loading?: boolean;
  onOpen(): void;
  onClose(): void;
  options: any[];
  label: string;
  labelKey: string;
  multiple?: boolean;
  limitTags?: number;
  style?: React.CSSProperties;
  onChange?(value: any | any[] | null): void
}

const AutoComplete = ({
  label, loading, labelKey, onChange, ...rest
}: Props) => (
  <AutocompleteMaterial
    getOptionLabel={option => option[labelKey]}
    onChange={(e, newValue) => void onChange?.(newValue)}
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
    {...rest}
  />
);

export default AutoComplete;
