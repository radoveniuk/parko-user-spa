import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const HeaderWrapper = styled.div`
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 35px;

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

    .link {
      margin-left: -7px;
    }

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
        border: 1px solid ${themeConfig.palette.primary.main};
      }
    }

    .open-menu-btn {
      border: 1px solid;
      border-radius: 50%;
      min-width: 43px !important;
      max-width: 43px !important;
      .text {
        display: none;
      }
    }
  }
`;
