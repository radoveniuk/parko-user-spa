import styled from 'styled-components';

import { themeConfig } from 'theme';
import { PC } from 'theme/sizeBreakpoints';

export const FilterWrapper = styled.div`
  overflow: hidden;
  transition: 0.4s all;
  max-width: 0;

  &.active {
    margin-right: 25px;
    max-width: 355px;

    @media (max-width: ${PC}) {
      max-width: 100%;
    }
  }

  @media (max-width: ${PC}) {
    width: 100%;
  }

  .MuiPaper-root {
    border: 1px solid ${themeConfig.client.secondary.light10};
    border-radius: 3px;
  }

  .search-projects {
    margin-top: 30px;

    .MuiInput-underline:hover {
      &::before {
        border-color: ${themeConfig.client.secondary.light10};
      }
    }
    .MuiInput-underline::before {
      border-color: ${themeConfig.client.secondary.light10};
    }
  }

  .title-choose {
    color: ${themeConfig.palette.primary.main};
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    margin: 17px 0;
    display: block;
  }

  .list-projects {
    max-height: 300px;
    overflow-y: auto;
  }

  .text-control {
    color: ${themeConfig.palette.primary.main};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    display: block;
    margin-top: 10px;
  }

  .divider-bottom {
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-top: 10px;
  }
`;

export const ContainerWrapper = styled.div`
  position: relative;
  min-width: 50px;

  @media (max-width: ${PC}) {
    width: 100%;
    min-width: 20px;
    max-width: 20px;
  }

  .btn-open {
    position: absolute;
    right: -20px;
    width: 40px;
    height: 40px;
    border: 1px solid #BDBDBD;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 25%;
    transform: translateY(-25%);
    transition: 0.2s;

    svg {
      fill: rgba(0, 0, 0, 0.54);
    }

    &:hover {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
    }

    &.active {
      right: 8px;

      @media (max-width: ${PC}) {
        right: -8px;
      }

      svg {
        transition: 0.4s;
        transform: rotate(180deg);
      }
    }
  }
`;
