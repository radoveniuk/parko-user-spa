import React from 'react';
import AvatarMaterial, { AvatarProps } from '@mui/material/Avatar';

import { themeConfig } from 'theme';

type Props = AvatarProps & {
  username?: string;
};

const Avatar = ({ username, children, ...rest }: Props) => (
  <AvatarMaterial sx={{ bgcolor: themeConfig.palette.primary.light }} {...rest}>
    {username ? username.split(' ').slice(0, 2).map(item => item[0]).join('').toUpperCase() : children}
  </AvatarMaterial>
);

export default Avatar;
