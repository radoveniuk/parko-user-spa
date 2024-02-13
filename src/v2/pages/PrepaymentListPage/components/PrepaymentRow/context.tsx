import React, { createContext, PropsWithChildren, useContext } from 'react';

import { ClientRowProps } from './types';

const RowContext = createContext<ClientRowProps | undefined>(undefined);
RowContext.displayName = 'RowContext';

const PrepaymentRowProvider = ({ children, ...props }: PropsWithChildren<ClientRowProps>) => (
  <RowContext.Provider value={props}>
    {children}
  </RowContext.Provider>
);

export default PrepaymentRowProvider;

export const usePrepaymentRowContext = () => {
  const values = useContext(RowContext);
  if (!values) throw new Error();
  return values;
};
