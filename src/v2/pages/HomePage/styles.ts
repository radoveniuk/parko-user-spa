import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const NoDataWrapper = styled.div`
  display: flex;
  height: calc(100vh - 345px);
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
  font-size: 20px;
`;

export const DashboardWrapper = styled.div`
margin: 30px 0;
max-height: calc(100vh - 120px);
overflow: auto;

@media (max-width: ${SM}) {
  margin: 10px 0;
  max-height: calc(100vh - 80px);
}

.cards {
  display: flex;
  gap: 24px;
  position: relative;

  @media (max-width: 1150px) {
    flex-direction: column;
    width: calc(100vw - 200px);
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
    @media (max-width: 1350px) {
      width: 500px;
    }
    @media (max-width: 1150px) {
      width: 100%;
    }
  }
}

@media (min-width: 1800px) {
  .cards, .col {
    display: contents !important;
  }
  display: grid;
  grid-template-columns: repeat(auto-fill, 550px);
  grid-auto-rows: minmax(100px, auto);
  gap: 20px;
}
`;
