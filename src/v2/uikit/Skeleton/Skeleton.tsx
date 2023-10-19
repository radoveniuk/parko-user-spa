import React, { memo } from 'react';
import SkeletonMUI from '@mui/material/Skeleton';

type Props = {
  width?: string | number;
  height?: string | number;
};

const Skeleton = ({ width = '100%', height = 30 }: Props) => <SkeletonMUI variant="rectangular" width={width} height={height} />;

export default memo(Skeleton);
