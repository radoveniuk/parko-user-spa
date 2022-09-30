import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ResidencesWrapper = styled.div`
  .table-link {
    color: ${themeConfig.palette.primary.light};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
