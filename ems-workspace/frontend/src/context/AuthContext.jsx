import React, { createContext, useContext } from 'react';
import useClientStore from '../store/useClientStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const store = useClientStore();

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
