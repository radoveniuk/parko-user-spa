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
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    &.error {
      color: ${themeConfig.palette.error.main};
    }
  }
  &:has(.Mui-focused) {
    .label:not(.error) {
      color: ${themeConfig.palette.primary.main};
    }
  }
  .MuiAutocomplete-inputRoot {
    padding: 0 5px !important;
  }
  .MuiInputBase-root {
    min-height: 36px;
    padding-right: 3px;
    background: ${({ fieldColor }) => fieldColor || '#fff'};
    @media (max-width: ${SM}) {
      min-height: 48px;
    }
    &:not(.MuiAutocomplete-inputRoot):not(.MuiInputBase-multiline) {
      height: 36px;
      @media (max-width: ${SM}) {
        height: 48px;
      }
    }
    &:has(input:disabled), &:has(textarea:disabled) {
      background: #F3F3F3;
    }
    input:disabled {
      -webkit-text-fill-color: rgba(0, 0, 0);
    }

    input {
      padding: 10px 14px;
      /* height: -webkit-fill-available; */
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
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
