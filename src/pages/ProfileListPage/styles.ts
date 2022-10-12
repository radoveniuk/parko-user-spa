import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ProfileListPageWrapper = styled.div`
  .users-table {
    grid-template-columns: 30px 1fr 1fr 1fr 1fr;
    
    .table-link {
      color: ${themeConfig.palette.primary.light};
      cursor: pointer;
  
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
