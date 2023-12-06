import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ProfileAdminPageWrapper = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  /* height: calc(100vh - 60px); */
  /* max-height: calc(100vh - 60px); */
  /* overflow: hidden; */
  padding-left: 1px;
  margin-top: 18px;

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
    max-height: none;
    height: 100%;
  }
`;

export const ContentWrapper = styled.div`
  padding: 0 30px;

  @media (max-width: ${SM}) {
    padding: 10px;
  }

  .cards {
    display: flex;
    gap: 24px;
    position: relative;

    @media (max-width: 1350px) {
      flex-direction: column;
      width: calc(100vw - 508px);
      gap: 20px;
    }

    @media (max-width: 700px) {
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
