import React, { createContext, ReactNode, useContext, useState } from 'react';

type ContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const FilterBarVisibilityContext = createContext<ContextType | undefined>(undefined);

FilterBarVisibilityContext.displayName = 'ResidenceContext';

const FilterBarVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const state = useState(true);

  return (
    <FilterBarVisibilityContext.Provider value={state}>
      {children}
    </FilterBarVisibilityContext.Provider>
  );
};

export default FilterBarVisibilityProvider;

export const useFilterBarVisibility = () => {
  const context = useContext(FilterBarVisibilityContext);
  if (!context) {
    throw new Error('FilterBarVisibility Context not connected');
  }
  return context;
};
