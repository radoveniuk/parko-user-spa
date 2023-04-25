import React, { memo } from 'react';
import { Stack as StackMui, StackProps } from '@mui/material';

const Stack = (props: StackProps) => (
  <StackMui {...props} />
);

export default memo(Stack);
