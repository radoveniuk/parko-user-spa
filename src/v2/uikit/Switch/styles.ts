import ButtonMui from '@mui/lab/LoadingButton';
import styled, { css } from 'styled-components';

export const Button = styled(ButtonMui)`
  box-shadow: none !important;
  text-transform: unset !important;
  gap: 5px;
  border-radius: 2px !important;
  white-space: nowrap;
  /* height: 36px; */
  /* border: 1px solid transparent; */

  ${props => props.variant === 'outlined' && css`
    &:disabled {
      border: 1px solid #b4b4b4 !important;
    }
  `}
`;
