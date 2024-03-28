import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const OrderParticipationFormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  row-gap: 12px;
  margin-bottom: 12px;
  max-width: 600px;
  
  .fullwidth {
    grid-column: 1 / 3;
  }

  @media (max-width: ${TB}) {
    grid-template-columns: 1fr;
    width: 100%;

    .fullwidth {
      grid-column: 1;
    }
  }
`;

export const InfoWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 20px;
  position: relative;

  .toggle-view {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .info {
    margin-top: 6px;
    color: #717171;
    font-size: 14px;
    &.hide {
      display: none;
    }
  }
`;
