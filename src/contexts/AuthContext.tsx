import React, {
  createContext, ReactNode, useContext, useState,
} from 'react';

type contextType = {
  isAuth: boolean,
};

const AuthContext = createContext<contextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth] = useState(true);

  return (
    <AuthContext.Provider value={{ isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): contextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Auth provider not exist');
  }
  return authContext;
};

export default AuthProvider;
