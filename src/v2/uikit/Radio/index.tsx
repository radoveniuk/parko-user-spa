import React, { memo } from 'react';
import { RadioProps } from '@mui/material';

import { RadioWrapper } from './styles';

const Radio = (props: RadioProps) => (
  <RadioWrapper {...props}/>
);

export default memo(Radio);
