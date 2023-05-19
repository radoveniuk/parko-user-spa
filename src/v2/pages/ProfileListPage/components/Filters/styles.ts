import styled from 'styled-components';

import { themeConfig } from 'theme';

export const FilterWrapper = styled.div`
  max-width: 355px;

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
