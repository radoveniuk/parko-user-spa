import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Tab, TabPanel, Tabs, TabsContainer } from '.';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const VerticalTabsRender = () => (
  <div style={{ display: 'flex', gap: 20 }}>
    <Tabs
      orientation="vertical"
      variant="scrollable"
      sx={{ '& .MuiTabs-indicator': { display: 'none' }, width: 300 }}
    >
      <Tab label="Screen 1" />
      <Tab label="Screen 2" />
    </Tabs>
    <TabPanel index={0}>Screen 1</TabPanel>
    <TabPanel index={1}>Screen 2</TabPanel>
  </div>
);

export const VerticalTabs: Story = {
  render: () => <TabsContainer><VerticalTabsRender /></TabsContainer>,
};
const HorisontalTabsRender = () => (
  <div>
    <Tabs>
      <Tab label="Screen 1" />
      <Tab label="Screen 2" />
    </Tabs>
    <TabPanel index={0}>Screen 1</TabPanel>
    <TabPanel index={1}>Screen 2</TabPanel>
  </div>
);

export const HorisontalTabs: Story = {
  render: () => <TabsContainer><HorisontalTabsRender /></TabsContainer>,
};
