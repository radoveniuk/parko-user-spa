import React, { memo, ReactElement } from 'react';
import { Box, styled, Tooltip as TooltipMUI, tooltipClasses } from '@mui/material';

export type TooltipProps = {
  className?: string;
  title: string;
  children: ReactElement<any, any>;
}

const Tooltip = styled(({ className, children, title }: TooltipProps) => (
  <TooltipMUI title={title} classes={{ popper: className }}>
    <Box
      sx={{ maxWidth: 'min-content' }}
    >
      {children}
    </Box>
  </TooltipMUI>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}));

export default memo(Tooltip);
