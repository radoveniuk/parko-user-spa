import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const BreadCrumbsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  background: #FAFAFA;
  padding: 0 30px;
  height: 58px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14);

  @media (max-width: ${SM}) {
    display: none;
  }

  .breadcrumbs, .breadcrumb, .actions {
    display: flex;
    gap: 6px;
    align-items: center;
  }
`;
