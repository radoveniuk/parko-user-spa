import React from 'react';
import { TabProps } from '@mui/material/Tab';
import { TabsProps } from '@mui/material/Tabs';

import { StyledTab, StyledTabs, TabPanelWrapper } from './styles';
import TabsProvider, { useTabs } from './TabsContext';

type BaseProps = {
  children: React.ReactNode;
  defaultTab?: number;
};

export const TabsContainer = (props: BaseProps) => (<TabsProvider {...props} />);

export const Tabs = ({ children, ...rest }: BaseProps & TabsProps) => {
  const [tab, setTab] = useTabs();
  return (
    <StyledTabs value={tab} onChange={(e, value) => void setTab(value)} {...rest}>{children}</StyledTabs>
  );
};

export const Tab = ({ ...rest }: TabProps) => (
  <StyledTab {...rest} />
);

interface TabPanelProps {
  children?: React.ReactNode;
  className?: string;
  index: number;
  hiddenRender?: boolean;
}

export const TabPanel = ({ children, index, className, hiddenRender = true }: TabPanelProps) => {
  const [value] = useTabs();
  if (!hiddenRender && value !== index) return null;
  return (
    <TabPanelWrapper
      role="tabpanel"
      hidden={value !== index}
      className={`${className} ${value !== index ? 'hidden' : ''}`}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {children}
    </TabPanelWrapper>
  );
};
