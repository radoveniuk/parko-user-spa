import styled from 'styled-components';

import { SM, TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  .form {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 250px);
    padding: 0 8px;
    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }
  }
`;

export const CategoriesWrapper = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    @media (max-width: ${SM}) {
      grid-template-columns: 1fr;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 6px;

    .category {
      display: flex;
      gap: 6px;
      align-items: center;
      color: #4d4d4dde;
      .name {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .date {
        font-size: 0.7em;
        color: #b9b9b9;
        margin-left: auto;
      }
    }
  }
`;
