import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const ClientPageWrapper = styled.div`
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
  padding-left: 30px;
  max-height: calc(100vh - 172px);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${TB}) {
    padding: 10px;
    max-height: 100%;
  }
`;
