import React, { memo } from 'react';
import { FormControlLabel as FormControlLabelUI, FormControlLabelProps } from '@mui/material';

const FormControlLabel = (props: FormControlLabelProps) => (
  <FormControlLabelUI {...props}/>
);

export default memo(FormControlLabel);
