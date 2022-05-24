import React from 'react';
import { TabProps, Tabs as TabsMaterial, Tab as TabMaterial } from '@mui/material';
import TabsProvider, { useTabs } from './TabsContext';
import { TabsWrapper } from './styles';

type BaseProps = {
  children: React.ReactNode;
};

export const TabsContainer = ({ children }: BaseProps) => (
  <TabsProvider>
    {children}
  </TabsProvider>
);

export const Tabs = ({ children }: BaseProps) => {
  const [tab, setTab] = useTabs();
  return (
    <TabsWrapper>
      <TabsMaterial value={tab} onChange={(e, value) => void setTab(value)}>{children}</TabsMaterial>
    </TabsWrapper>
  );
};

export const Tab = ({ ...rest }: TabProps) => (
  <TabMaterial {...rest} />
);

interface TabPanelProps {
  children?: React.ReactNode;
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
