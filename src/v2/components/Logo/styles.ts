import styled from 'styled-components';

import { themeConfig } from 'theme';

export const LogoWrapper = styled.div`
  display: grid;
  justify-content: center;
  grid-auto-flow: column;
  gap: 10px;
  align-items: center;

  h1 {
    color: ${themeConfig.palette.primary.main};
    font-size: 26px;
    line-height: 30px;
    letter-spacing: -0.01em;
    margin: 0;
  }
`;
