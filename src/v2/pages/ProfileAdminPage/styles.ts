import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const ProfileAdminPageWrapper = styled.div`
  margin-top: 18px;
  
  .content {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 360px 1fr;
    padding-left: 1px;
  
    @media (max-width: ${TB}) {
      margin-top: 0;
      grid-template-columns: 1fr;
      max-height: none;
      height: 100%;
    }
  }
  @media (max-width: ${TB}) {
    margin-top: 0;
  }
`;

export const ContentWrapper = styled.div`
  padding: 0 30px;
  max-height: calc(100vh - 175px);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${TB}) {
    padding: 10px;
    max-height: 100%;
  }

  .cards {
    padding: 1px 0;
    display: flex;
    gap: 24px;
    position: relative;

    @media (max-width: 1350px) {
      flex-direction: column;
      width: calc(100vw - 508px);
      gap: 20px;
    }

    @media (max-width: ${TB}) {
      width: 100%;
    }

    .col {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    
      @media (min-width: 1800px) {
        width: 600px;
      }
      @media (max-width: 1799px) {
        flex: 1;
      }
      @media (max-width: 1600px) {
        width: 50%;
      }
      @media (max-width: 1350px) {
        width: 600px;
      }
      @media (max-width: 1150px) {
        width: 100%;
      }
    }
  }
`;
