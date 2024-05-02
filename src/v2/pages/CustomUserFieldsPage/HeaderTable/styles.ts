import styled from 'styled-components';

import { themeConfig } from 'theme';

export const MenuItemContent = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  &.btn {
    color: ${themeConfig.palette.primary.main};
  }
`;
