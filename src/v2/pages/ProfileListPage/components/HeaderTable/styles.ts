import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const HeaderWrapper = styled.div`
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 35px;

  .counter {
    display: flex;
    align-items: center;
    .MuiSkeleton-root {
      margin-left: 5px;
    }
  }

  .link {
    color: #e72a33;
    display: flex;
    align-items: center;
  }

  .bold {
    font-weight: bold;
  }

  .divider {
    height: 15px;
    background: #aaa;
  }

  .small-btn, .small-icon {
    display: none;
  }

  @media (max-width: ${TB}) {
    padding: 5px 10px;
    gap: 5px;

    .big-btn, .big-icon {
      display: none;
    }

    .small-icon {
      display: block;
    }

    .small-btn {
      display: flex;
      border: 1px solid;
      &.primary {
        color: ${themeConfig.palette.primary.main};
        border: 1px solid ${themeConfig.palette.primary.main} !important;
      }
    }
  }
`;

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 12px;
  height: 100%;

  .apply-filter-btn {
    margin-top: auto;
  }
`;
