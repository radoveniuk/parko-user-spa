import React from 'react';
import { TabProps } from '@mui/material/Tab';
import { TabsProps } from '@mui/material/Tabs';

import { StyledTab, StyledTabs } from './styles';
import TabsProvider, { useTabs } from './TabsContext';

type BaseProps = {
  children: React.ReactNode;
};

export const TabsContainer = ({ children }: BaseProps) => (
  <TabsProvider>
    {children}
  </TabsProvider>
);

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
}

export const TabPanel = ({ children, index, ...rest }: TabPanelProps) => {
  const [value] = useTabs();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && children}
    </div>
  );
};
