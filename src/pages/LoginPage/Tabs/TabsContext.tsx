import React, { createContext, useContext, useState } from 'react';

export type Tab = 'login' | 'register';

const TabsContext = createContext<[Tab, React.Dispatch<React.SetStateAction<Tab>>] | undefined>(undefined);
TabsContext.displayName = 'TabsContext';

const TabsProvider = ({ children }: {children: React.ReactNode}) => {
  const tabsState = useState<Tab>('login');
  return (
    <TabsContext.Provider value={tabsState}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const tabsContext = useContext(TabsContext);
  if (tabsContext === undefined) {
    throw new Error();
  }
  return tabsContext;
};

export default TabsProvider;
