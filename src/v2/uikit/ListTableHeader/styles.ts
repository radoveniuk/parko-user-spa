import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const ListTableHeaderWrapper = styled.div`
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 35px;
  height: 36px;

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

  .counter {
    display: flex;
    gap: 6px;
    align-items: center;
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
      margin-left: 15px;
      &.primary {
        color: ${themeConfig.palette.primary.main};
        border: 1px solid ${themeConfig.palette.primary.main} !important;
      }
    }
  }
`;

export const MenuItemContent = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  &.btn {
    color: ${themeConfig.palette.primary.main};
  }
`;
