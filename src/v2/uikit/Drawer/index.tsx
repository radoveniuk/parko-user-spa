import React, { memo } from 'react';
import { Drawer as DrawerMui, DrawerProps } from '@mui/material';

const Drawer = ({ children, ...rest }: DrawerProps) => (
  <DrawerMui {...rest}>
    {children}
  </DrawerMui>
);

export default memo(Drawer);
