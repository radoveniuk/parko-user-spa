import React, { createContext, PropsWithChildren, useContext } from 'react';

import { ClientRowProps } from './types';

const RowContext = createContext<ClientRowProps | undefined>(undefined);
RowContext.displayName = 'RowContext';

const ClientRowProvider = ({ children, ...props }: PropsWithChildren<ClientRowProps>) => (
  <RowContext.Provider value={props}>
    {children}
  </RowContext.Provider>
);

export default ClientRowProvider;

export const useClientRowContext = () => {
  const values = useContext(RowContext);
  if (!values) throw new Error();
  return values;
};
