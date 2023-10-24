import styled from 'styled-components';

import { themeConfig } from 'theme';

export const InputWrapper = styled.label`
  display: block;
  .label {
    color: #717171;
    font-size: 14px;
    margin-bottom: 3px;
  }
  &:has(.Mui-focused) {
    .label {
      color: ${themeConfig.palette.primary.main};
    }
  }
  .MuiInputBase-root {
    height: 40px;
    background: #fff;
    padding-right: 5px;
    &:has(input:disabled) {
      background-color: #D0D0D0;
    }
    input:disabled {
      -webkit-text-fill-color: rgba(0, 0, 0);
    }

    .MuiInputAdornment-positionStart {
      padding-right: 10px;
      border-right: 1px solid rgba(0, 0, 0, 0.23);
      max-height: 40px;
      height: 40px;
    }
  }
`;
