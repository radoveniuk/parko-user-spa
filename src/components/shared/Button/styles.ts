import { Button as ButtonMaterial } from '@mui/material';
import styled, { css } from 'styled-components';

import { themeConfig } from 'theme';

export const StyledButton = styled(ButtonMaterial)`
  border-radius: 2px;
  display: flex;
  gap: 0.7rem;

  ${props => props.variant === 'contained' && props.color === 'primary' && css`
    &:hover {
      background-color: ${themeConfig.palette.primary.light} !important;
    }
  `}

  ${props => props.variant === 'contained' && props.color === 'success' && css`
    color: #fff !important;
  `}
`;
