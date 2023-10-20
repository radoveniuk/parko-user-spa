import styled from 'styled-components';

import { themeConfig } from 'theme';

export const Toolbar = styled.div`
  background-color: ${themeConfig.palette.primary.main};
  color: #fff;
  display: flex;
  padding: 12px 24px;
  align-items: center;
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-left: 20px;
  }
  .save-btn {
    margin-left: auto;
  }
`;
