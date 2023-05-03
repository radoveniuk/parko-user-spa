import styled from 'styled-components';

import { PC } from 'theme/sizeBreakpoints';

export const SearchWrapper = styled.div`
  width: 648px;

  @media (max-width: ${PC}) {
    display: none;
  }

  .MuiInputBase-root {
    border-radius: 8px;
    background-color: #F5F5F5;
  }

  .MuiInputBase-input {
    padding: 12.5px 14px;
  }

  fieldset {
    border-color: #F5F5F5 !important;
  }

  .search-icon {
    display: flex;
    align-items: center;

    svg {
      width: 30px;
      height: 30px;
      fill: #5f6368;
    }
  }
`;
