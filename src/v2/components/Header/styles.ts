import styled from 'styled-components';

import { themeConfig } from 'theme';
import { PC } from 'theme/sizeBreakpoints';

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  .header-left {
    display: flex;
    gap: 25px;
    align-items: center;

    @media (max-width: ${PC}) {
      gap: 10px;
    }
  }

  .header-right {
    display: contents;
  }

  .user-avatar {
    cursor: pointer;
  }

  @media (max-width: ${PC}) {
    .header-right {
      display: none;
    }
  }

  .menu {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 0;
    margin: 0 15px 0 15px;
    transition: .2s;

    @media (min-width: ${PC}) {
      &.opened {
        margin: 0 213px 0 17px;
      }
    }
  }
  .line {
    fill: none;
    stroke-width: 6;
    transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
      stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .line1 {
    stroke-dasharray: 60 207;
    stroke-width: 6;
  }
  .line2 {
    stroke-dasharray: 60 60;
    stroke-width: 6;
  }
  .line3 {
    stroke-dasharray: 60 207;
    stroke-width: 6;
  }
  .opened .line1 {
    stroke-dasharray: 90 207;
    stroke-dashoffset: -134;
    stroke-width: 6;
  }
  .opened .line2 {
    stroke-dasharray: 1 60;
    stroke-dashoffset: -30;
    stroke-width: 6;
  }
  .opened .line3 {
    stroke-dasharray: 90 207;
    stroke-dashoffset: -134;
    stroke-width: 6;
  }
`;
