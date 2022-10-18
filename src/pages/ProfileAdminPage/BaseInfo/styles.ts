import styled from 'styled-components';

import { themeConfig } from 'theme';

export const BaseInfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  .user-card {
    border: 1px solid #c7c7c7;
    border-radius: 2px;
    margin: 20px;
    box-shadow: 0px 10px 21px -10px rgba(0,0,0,0.75);
    padding: 12px;
    overflow-y: auto;
    max-height: calc(100vh - 270px);
    max-width: 100%;

    .user-card-title {
      text-align: center;
      margin: 5px 0;
    }

    .user-card-field {
      p {
        color: #888888;
        margin: 5px 0;
        font-size: 12px;
        min-width: 300px;
      }

      strong {
        color: ${themeConfig.palette.primary.main};
      }
    }
  }
  
  .user-settings {
    margin: 20px;

    .settings-item {
      margin-top: 12px;
    }
  }

  .reseted-pass {
    display: flex;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #ac3b61;
    background-color: #eee1dc;
    padding-left: 15px;
    margin-top: 10px;

    button {
      margin-left: auto;
    }
  }
`;
