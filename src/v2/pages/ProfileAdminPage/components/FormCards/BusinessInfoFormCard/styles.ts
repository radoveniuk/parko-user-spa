import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const CorporateBodiesSearchField = styled.div`
  position: relative;
  display: flex;
  grid-column: 1 / 3;
  align-items: flex-end;
  
  .search-input {
    flex-grow: 1;

    .MuiInputBase-root {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;

      fieldset {
        border-right: none;
      }

      &.Mui-focused {
        border-right: 2px;
        fieldset {
          border-right: 2px solid ${themeConfig.palette.primary.main};
        }
      }
    }
  }

  .search-btn {
    display: flex;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    width: 120px;
    max-height: 36px;
  }

  @media (max-width: ${TB}) {
    grid-column: 1 / 1;
    .search-btn {
      height: 48px;
      font-size: 0px;
      min-width: 40px;
      width: 48px;
      padding: 0;
      gap: 0;
    }
  }
`;

export const CorporateBodiesDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: calc(100% - 120px);
  background: #fff;
  z-index: 1;
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  max-height: 200px;
  overflow: auto;

  li {
    padding: 6px 12px;
    cursor: pointer;
    transition: .3s;

    &:hover {
      background-color: #fafafa;
    }

    .title {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .address {
      font-size: 11px;
      color: #717171;
    }
  }

  @media (max-width: ${TB}) {
    width: 100%;
  }
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
`;
