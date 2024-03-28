import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const HeaderWrapper = styled.div`
  background: rgb(245, 245, 245);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 19px 35px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

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
