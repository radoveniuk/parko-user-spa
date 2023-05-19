import React, { memo } from 'react';
import { CheckboxProps } from '@mui/material';

import { CheckboxWrapper, FormControlLabelWrapper } from './styles';

type TCheckbox = CheckboxProps & {
    label?: string
}
const Checkbox = (props: TCheckbox) => (
  <FormControlLabelWrapper control={<CheckboxWrapper {...props} />} label={props.label} />
);

export default memo(Checkbox);
