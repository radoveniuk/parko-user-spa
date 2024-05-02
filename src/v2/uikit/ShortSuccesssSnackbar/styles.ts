import styled from 'styled-components';

import { themeConfig } from 'theme';

export const CheckmarkWrapper = styled.div`
  box-shadow: 0px 0px 50px 0px rgba(9, 56, 33, 0.6);
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${themeConfig.palette.success.main};
  border-radius: 50%;
`;
