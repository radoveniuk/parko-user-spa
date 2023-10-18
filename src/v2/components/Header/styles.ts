import styled from 'styled-components';

import { themeConfig } from 'theme';
import { PC } from 'theme/sizeBreakpoints';

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 10px 25px 0 5px;

  .header-exit {
    color: ${themeConfig.client.secondary.dark};
    font-size: 16px;
    line-height: 24px;
  }

  .header-name {
    color: ${themeConfig.client.secondary.dark10};
    font-size: 16px;
  }

  .toggle-menu-icon {
    margin-left: 10px;
  }

  .header-left {
    display: flex;
    gap: 25px;
    align-items: center;

    @media (max-width: ${PC}) {
      gap: 10px;
    }
  }

  @media (max-width: ${PC}) {
    .header-right {
      display: none;
    }
  }
`;
