import styled from 'styled-components';

import { themeConfig } from 'theme';

export const CheckmarkWrapper = styled.div`
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${themeConfig.palette.success.main};
  border-radius: 50%;
`;
