import React, { createContext, PropsWithChildren, useContext } from 'react';

import { ProfileRowProps } from './types';

const RowContext = createContext<ProfileRowProps | undefined>(undefined);
RowContext.displayName = 'RowContext';

const ProfileRowProvider = ({ children, ...props }: PropsWithChildren<ProfileRowProps>) => (
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
