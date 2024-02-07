import styled from 'styled-components';

import { themeConfig } from 'theme';

export const Button = styled.button.attrs({ className: 'AddFilterButton' })`
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px dashed #A1A1A1;
  border-radius: 4px;
  cursor: pointer;
  color: #717171;
  font-weight: 400;
  height: 36px;
  width: 180px;
  justify-content: center;
  transition: .3s;
  font-size: 14px;

  &:hover {
    background-color: #7171710f;
  }
  &:active {
    background-color: transparent;
  }
`;

export const MenuWrapper = styled.div`
  width: 300px;
  padding: 12px;

  .filter-item {
    padding: 6px;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background-color: #f3f3f3;
    }
  }
`;

export const MenuToolbar = styled.div`
  padding: 12px;
  color: #fff;
  background-color: ${themeConfig.palette.primary.main};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SearchInput = styled.input.attrs({ autoFocus: true })`
  border: 0;
  height: 36px;
  outline: none;
`;
