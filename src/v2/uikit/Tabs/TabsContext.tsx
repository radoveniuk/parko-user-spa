import React, {
  createContext, ReactNode, useContext, useState,
} from 'react';

type BaseProps = {
  children: ReactNode;
  defaultTab?: number;
};

type contextType = [number, (v: number) => void]

const TabsContext = createContext<contextType | undefined>(undefined);
TabsContext.displayName = 'TabsContext';

const TabsProvider = ({ children, defaultTab = 0 }: BaseProps) => {
  const activeTabState = useState(defaultTab);

  return (
    <TabsContext.Provider value={activeTabState}>
      {children}
    </TabsContext.Provider>
  );
};

export default TabsProvider;

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Context not connected');
  }
  return context;
};
