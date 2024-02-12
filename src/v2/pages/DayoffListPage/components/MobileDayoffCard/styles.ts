import styled from 'styled-components';

import { themeConfig } from 'theme';

export const MobileClientCardWrapper = styled.div`
  .card {
    margin: 3px 6px;
    padding: 12px 6px 6px 6px;
    border-radius: 5px;
    position: relative;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    position: relative;
    
    .date {
      color: rgb(126, 126, 126);
      position: absolute;
      right: 6px;
      top: 6px;
      font-size: 11px;
    }
    .user {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 15px;

      .info {
        display: flex;
        flex-direction: column;
        gap: 5px;
        
        .side-info {
          display: flex;
          gap: 5px;
          .project {
            background-color: ${themeConfig.palette.primary.light};
            color: rgb(255, 255, 255);
            font-size: 0.7rem;
            padding: 1px 4px;
            border-radius: 2px;
            max-width: min-content;
            white-space: nowrap;
          }
        }
      }
    }

    .prepayment {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px 15px;

      .row {
        display: flex;
        gap: 5px;
        color: #717171;
        align-items: center;
      }
    }

    .actions {
      position: absolute;
      bottom: 6px;
      right: 6px;
    }
  }
`;
