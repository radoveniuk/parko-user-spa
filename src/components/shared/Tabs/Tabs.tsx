import React from 'react';
import { Tab as TabMaterial, TabProps, Tabs as TabsMaterial } from '@mui/material';

import { TabsWrapper } from './styles';
import TabsProvider, { useTabs } from './TabsContext';

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
