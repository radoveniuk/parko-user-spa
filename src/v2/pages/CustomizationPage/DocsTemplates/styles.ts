import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const DocsTemplatesWrapper = styled.div`
  .container-table {
    margin-top: 6px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14);
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    flex: auto;
    width: 100%;

    .mobile-list {
      display: none;
    }

    @media (max-width: ${TB}) {
      box-shadow: none;
      .pagination-bottom, .daysoff-table {
        display: none;
      }
      .mobile-list {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
`;

export const FilterTableWrapper = styled.div`
  display: flex;
  overflow: auto;
  align-items: end;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 14px 30px;
  @media (max-width: ${TB}) {
    display: none;;
  }
`;
