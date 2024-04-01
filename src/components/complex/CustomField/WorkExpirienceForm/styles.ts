import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const WorkExpirienceFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px 0;
  gap: 6px;
  border-top: 1px solid #D0D0D0;
  border-bottom: 1px solid #D0D0D0;

  &:has(.card) {
    .add-btn {
      margin-top: 8px;
    }
  }

  .add-btn {
    max-width: max-content;
  }

  .card {
    background: #FAFAFA;
    border: 1px solid #D0D0D0;
    border-radius: 5px;
    padding: 15px 20px;
    position: relative;

    .delete-btn {
      position: absolute;
      top: 6px;
      right: 6px;
    }

    .title {
      font-weight: 600;
      margin-bottom: 12px;
    }

    .form {
      display: grid;
      gap: 16px;
      grid-template-columns: 230px 230px;
      
      @media (max-width: ${TB}) {
        grid-template-columns: 1fr;
      }
    }
  }
`;
