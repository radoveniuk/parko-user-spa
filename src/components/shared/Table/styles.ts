import styled from 'styled-components';
import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const TableWrapper = styled.div`
  width: 100%;

  thead {
    background-color: ${themeConfig.palette.secondary.main};

    th {
      color: ${themeConfig.palette.secondary.contrastText}
    }
  }

  @media (max-width: ${SM}) {
    display: none;
  }
`;
