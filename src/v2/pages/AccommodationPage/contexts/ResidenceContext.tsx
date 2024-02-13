import React, { createContext, ReactNode, useContext, useState } from 'react';

import { IResidence } from 'interfaces/residence.interface'; ;

type ContextType = [IResidence | boolean, (v: IResidence | boolean) => void]

const ResidenceContext = createContext<ContextType | undefined>(undefined);

ResidenceContext.displayName = 'ResidenceContext';

const ResidenceProvider = ({ children }: { children: ReactNode }) => {
  const activeTabState = useState<IResidence | boolean>(false);

  return (
    <ResidenceContext.Provider value={activeTabState}>
      {children}
    </ResidenceContext.Provider>
  );
};

export default ResidenceProvider;

export const useActiveResidence = () => {
  const context = useContext(ResidenceContext);
  if (!context) {
    throw new Error('Context not connected');
  }
  return context;
};
