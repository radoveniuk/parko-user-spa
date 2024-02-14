import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const PageWrapper = styled.div`
  display: contents;
  @media (max-width: ${TB}) {
    .MuiTabs-flexContainer {
      justify-content: center;
    }
  }
  .MuiTabs-root {
    min-height: 42px;
  }
`;
