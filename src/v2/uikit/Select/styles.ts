import styled from 'styled-components';

import { themeConfig } from 'theme';

export const SelectWrapper = styled.label`
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
  .MuiInputBase-root {
    height: 40px;
    background: #fff;
    padding-right: 5px;

    svg {
      margin-top: 4px;
      margin-right: 5px;
    }

    div[role=combobox] {
      color: #131313;
      -webkit-text-fill-color: #131313;
    }

    &.Mui-disabled {
      background-color: #D0D0D0;
    }
  }
`;
