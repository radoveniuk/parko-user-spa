import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const InputWrapper = styled.label<{ fieldColor?: string }>`
  display: flex;
  flex-direction: column;
  position: relative;

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
    max-height: 24px;

    .MuiChip-deleteIcon {
      font-size: 18px;
    }

    .MuiChip-label {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }

  .MuiFormHelperText-root {
    position: absolute;
    bottom: -16px;
    margin-left: 0;
    font-size: 0.7em;
  }

  .options {
    z-index: 2;
    position: absolute;
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    list-style: none;
    margin: 0;
    top: 57px;

    .option {
      cursor: pointer;
      color: rgb(113, 113, 113);
      padding: 6px 12px;
      transition: all 0.3s ease 0s;

      &:hover {
        background-color: rgb(250, 250, 250);
      }
    }
  }
`;
