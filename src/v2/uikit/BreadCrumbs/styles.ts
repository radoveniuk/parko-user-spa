import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const BreadCrumbsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #FAFAFA;
  padding: 0 30px;
  height: 58px;

  @media (max-width: ${SM}) {
    display: none;
  }

  .breadcrumbs, .breadcrumb {
    display: flex;
    gap: 6px;
    align-items: center;
  }
`;
