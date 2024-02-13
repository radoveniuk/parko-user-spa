import React, { createContext, ReactNode, useContext, useState } from 'react';

import { IAccommodation } from 'interfaces/accommodation.interface'; ;

type ContextType = [IAccommodation | boolean, (v: IAccommodation | boolean) => void]

const AccommodationContext = createContext<ContextType | undefined>(undefined);

AccommodationContext.displayName = 'AccommodationContext';

const AccommodationProvider = ({ children }: { children: ReactNode }) => {
  const activeTabState = useState<IAccommodation | boolean>(false);

  return (
    <AccommodationContext.Provider value={activeTabState}>
      {children}
    </AccommodationContext.Provider>
  );
};

export default AccommodationProvider;

export const useActiveAccommodation = () => {
  const context = useContext(AccommodationContext);
  if (!context) {
    throw new Error('Context not connected');
  }
  return context;
};
