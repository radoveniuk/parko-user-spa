import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ColsSettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .toolbar {
    background-color: ${themeConfig.palette.primary.dark};
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
  }
  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 12px 24px;
  }
`;
