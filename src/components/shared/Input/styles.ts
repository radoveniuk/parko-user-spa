import styled from 'styled-components';
import { TextField as TextFieldMaterial } from '@mui/material';

export const TextField = styled(TextFieldMaterial)`
  input[type='number'] {
    -moz-appearance:textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
`;
