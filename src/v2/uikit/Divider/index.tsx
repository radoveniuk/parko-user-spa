import React, { memo } from 'react';
import { Divider as DividerUI, DividerProps } from '@mui/material';

const Divider = (props: DividerProps) => (
  <DividerUI {...props}/>
);

export default memo(Divider);
