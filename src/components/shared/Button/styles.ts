import styled, { css } from 'styled-components';
import { themeConfig } from 'theme';
import { Button as ButtonMaterial } from '@mui/material';

export const StyledButton = styled(ButtonMaterial)`
  border-radius: 2px;

  ${props => props.variant === 'contained' && props.color === 'primary' && css`
    &:hover {
      background-color: ${themeConfig.palette.primary.light} !important;
    }
  `}

  ${props => props.color === 'success' && css`
    color: #fff !important;
  `}
`;
