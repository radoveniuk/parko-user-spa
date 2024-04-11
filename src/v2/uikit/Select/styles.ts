import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const SelectWrapper = styled.label<{ fieldColor?: string }>`
  display: flex;
  flex-direction: column;

  &:has(.Mui-focused) {
    .label:not(.error) {
      color: ${themeConfig.palette.primary.main};
    }
  }
  
  .MuiInputBase-root {
    height: 36px;
    background: ${({ fieldColor }) => fieldColor || '#fff'};
    @media (max-width: ${SM}) {
      height: 48px;
    }

    svg {
      margin-top: 5px;
      margin-right: 8px;
    }

    div[role=combobox] {
      color: #131313;
      -webkit-text-fill-color: #131313;
      padding: 10px 14px !important;
      min-height: 16px !important;
      height: 16px !important;
      line-height: 16px !important;
      user-select: auto;
    }

    &.Mui-disabled {
      background-color: #f3f3f3 !important;
    }
  }
`;
