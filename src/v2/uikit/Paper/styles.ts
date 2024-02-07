import styled from 'styled-components';

import { themeConfig } from 'theme';

export const HeaderWrapper = styled.div`
  height: 57px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-size: 16px;
  color: ${themeConfig.client.secondary.dark30};
  border-bottom: 1px solid ${themeConfig.client.secondary.light10};
  font-weight: bold;
`;

export const ContentWrapper = styled.div`
  padding: 16px;
`;
