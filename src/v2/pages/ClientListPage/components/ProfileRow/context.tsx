import React, { createContext, PropsWithChildren, useContext } from 'react';

import { ClientRowProps } from './types';

const RowContext = createContext<ClientRowProps | undefined>(undefined);
RowContext.displayName = 'RowContext';

const ProfileRowProvider = ({ children, ...props }: PropsWithChildren<ClientRowProps>) => (
  <RowContext.Provider value={props}>
    {children}
  </RowContext.Provider>
);

export default ProfileRowProvider;

export const useProfileRowContext = () => {
  const values = useContext(RowContext);
  if (!values) throw new Error();
  return values;
};
