import styled from 'styled-components';

import { themeConfig } from 'theme';

export const InputWrapper = styled.label`
  display: flex;
  flex-direction: column;
  .label {
    color: #717171;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 3px;
  }
  &:has(.Mui-focused) {
    .label {
      color: ${themeConfig.palette.primary.main};
    }
  }
  .MuiAutocomplete-inputRoot {
    padding: 0 5px !important;
  }
  .MuiInputBase-root {
    min-height: 40px;
    &:not(.MuiAutocomplete-inputRoot) {
      height: 40px;
    }
    background: #fff;
    padding-right: 5px;
    &:has(input:disabled) {
      background-color: #D0D0D0;
    }
    input:disabled {
      -webkit-text-fill-color: rgba(0, 0, 0);
    }

    input {
      padding: 5px 10px;
    }

    .MuiInputAdornment-positionStart {
      padding-right: 10px;
      border-right: 1px solid rgba(0, 0, 0, 0.23);
      max-height: 40px;
      height: 40px;
    }
  }
  .MuiAutocomplete-tag {
    border-radius: 5px;
  }
`;
