import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import styled from 'styled-components';

export const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    display: none;
  }

  .MuiTabs-flexContainer:not(.MuiTabs-flexContainerVertical) {
    .MuiTab-root {
      min-height: 32px !important;
      padding: 6px 16px !important;
    }
  }

  .MuiTabs-flexContainerVertical {
    .MuiTab-root {
      min-height: 42px !important;
    }
  }
`;

export const StyledTab = styled(Tab)`
  -webkit-box-align: baseline !important;
  align-items: baseline !important;
  border-radius: 5px !important;
  color: rgb(97, 97, 97) !important;
  &.Mui-selected {
    background: rgb(224, 224, 224);
  }

  &.Mui-disabled {
    color: rgba(0, 0, 0, 0.38) !important;
  }
`;

export const TabPanelWrapper = styled.div`
  &.hidden {
    display: none !important;
  }
`;
