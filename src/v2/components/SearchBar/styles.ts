import styled from 'styled-components';

import { PC } from 'theme/sizeBreakpoints';

export const SearchWrapper = styled.div`
  width: 648px;
  position: relative;

  @media (max-width: ${PC}) {
    display: none;
  }

  .MuiInputBase-root {
    border-radius: 8px;
    background-color: #F5F5F5;
  }

  .MuiInputBase-input {
    padding: 12.5px 14px;
  }

  fieldset {
    border-color: #F5F5F5 !important;
  }

  .search-icon {
    display: flex;
    align-items: center;

    svg {
      width: 30px;
      height: 30px;
      fill: #5f6368;
    }
  }

  .results {
    z-index: 2;
    position: absolute;
    width: 643px;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 3px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    .subtitle {
      color: #9f9f9f;
      padding: 2px 12px;
      font-size: 12px;
    }

    a {
      color: #717171;
      padding: 6px 12px;
      transition: .3s;

      &:hover {
        background-color: #fafafa;
      }
    }
  }
`;
