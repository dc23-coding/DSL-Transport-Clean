import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [adminMode, setAdminMode] = useState(false);
  const [user, setUser] = useState(null); // Stores Supabase user object or simulated user
  const [userRole, setUserRole] = useState(null); // 'admin', 'driver', 'broker'

  const value = {
    user: adminMode ? { email: 'admin@dsltransport.com' } : user,
    userRole: adminMode ? 'admin' : userRole,
    loading: false,
    isAdmin: adminMode,
    setAdminMode,
    setUser,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
