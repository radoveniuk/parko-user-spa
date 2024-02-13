import React, { createContext, PropsWithChildren, useContext } from 'react';

import { RowProps } from './types';

const RowContext = createContext<RowProps | undefined>(undefined);
RowContext.displayName = 'RowContext';

const DayoffRowProvider = ({ children, ...props }: PropsWithChildren<RowProps>) => (
  <RowContext.Provider value={props}>
    {children}
  </RowContext.Provider>
);

export default DayoffRowProvider;

export const useDayoffRowContext = () => {
  const values = useContext(RowContext);
  if (!values) throw new Error();
  return values;
};
