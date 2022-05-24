import React, {
  createContext, ReactNode, useContext, useState,
} from 'react';

type contextType = [number, (v: number) => void]

const TabsContext = createContext<contextType | undefined>(undefined);
TabsContext.displayName = 'TabsContext';

const TabsProvider = ({ children }: { children: ReactNode }) => {
  const activeTabState = useState(0);

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
    throw new Error('Context not conected');
  }
  return context;
};
