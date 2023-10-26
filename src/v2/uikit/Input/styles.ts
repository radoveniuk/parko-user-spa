import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const InputWrapper = styled.label<{ fieldColor?: string }>`
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
    min-height: 36px;
    background: ${({ fieldColor }) => fieldColor || '#fff'};
    @media (max-width: ${SM}) {
      min-height: 48px;
    }
    &:not(.MuiAutocomplete-inputRoot) {
      height: 36px;
      @media (max-width: ${SM}) {
        height: 48px;
      }
    }
    &:has(input:disabled) {
      background: #F3F3F3;
    }
    input:disabled {
      -webkit-text-fill-color: rgba(0, 0, 0);
    }

    input {
      padding: 10px 14px;
      height: -webkit-fill-available;
    }

    .MuiInputAdornment-positionStart {
      padding-right: 10px;
      border-right: 1px solid rgba(0, 0, 0, 0.23);
      max-height: 36px;
      height: 36px;
      @media (max-width: ${SM}) {
        max-height: 48px;
        height: 48px;
      }
    }
  }
  .MuiAutocomplete-tag {
    border-radius: 5px;
  }
`;
