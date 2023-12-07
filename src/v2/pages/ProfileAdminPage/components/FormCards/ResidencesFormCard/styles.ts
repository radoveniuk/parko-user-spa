import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const ActionsCell = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

export const FinanceDialogContent = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 54px;

    @media (max-width: ${SM}) {
      grid-template-columns: 1fr;
    }
  }
  .actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    width: calc(100% - 24px);
    padding-bottom: 12px;
    padding-top: 12px;
  }
`;