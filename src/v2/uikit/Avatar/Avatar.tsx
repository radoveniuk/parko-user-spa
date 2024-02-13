import React from 'react';
import AvatarMaterial, { AvatarProps } from '@mui/material/Avatar';

import { themeConfig } from 'theme';

type Props = AvatarProps & {
  username?: string;
  size?: number;
};

const Avatar = ({ username, children, sx, size = 40, ...rest }: Props) => (
  <AvatarMaterial sx={{ bgcolor: themeConfig.palette.primary.light, width: size, height: size, fontSize: size * 0.5, ...sx }} {...rest}>
    {username ? username.split(' ').slice(0, 2).map(item => item[0]).join('').toUpperCase() : children}
  </AvatarMaterial>
);

export default Avatar;
