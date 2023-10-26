import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const SelectWrapper = styled.label<{ fieldColor?: string }>`
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
    height: 36px;
    background: ${({ fieldColor }) => fieldColor || '#fff'};
    @media (max-width: ${SM}) {
      height: 48px;
    }
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
      background-color: #f3f3f3 !important;
    }
  }
`;
