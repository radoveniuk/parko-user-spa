import styled from 'styled-components';

import { themeConfig } from 'theme';

export const MobileProfileCard = styled.div`
  .card {
    margin: 3px 6px;
    padding: 6px 12px;
    border-radius: 5px;
    position: relative;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: rgb(255, 255, 255);
    display: flex;
    position: relative;
    
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #faf9f8;
      gap: 12px;
      padding: 6px 12px;
      border-radius: 5px;

      .actions {
        display: flex;
        align-items: center;
      }
    }

    .right {
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .name {
        display: flex;
        gap: 6px;
        align-items: center;
        white-space: nowrap;
      }

      .name {
        color: #8397bc;
      }

      .screaning {
        color: ${themeConfig.palette.primary.main};
      }

      .date {
        color: #717171;
        font-size: .8rem;
      }

      .edit {
        position: absolute;
        right: 6px;
        bottom: 6px;
      }
    }
  }
`;
