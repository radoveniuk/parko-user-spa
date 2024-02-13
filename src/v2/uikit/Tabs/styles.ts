import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import styled from 'styled-components';

export const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    display: none;
  }
`;

export const StyledTab = styled(Tab)`
  -webkit-box-align: baseline !important;
  align-items: baseline !important;
  /* padding-left: 8px !important; */
  min-height: 42px !important;
  border-radius: 5px !important;
  color: rgb(97, 97, 97) !important;
  &.Mui-selected {
    background: rgb(224, 224, 224);
  }
`;

export const TabPanelWrapper = styled.div`
  &.hidden {
    display: none !important;
  }
`;
