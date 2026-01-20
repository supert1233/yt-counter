import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

    if (token && email) {
      setUser({ email, token });
    }
    if (adminToken && username) {
      setAdmin({ username, token: adminToken });
    }
    setLoading(false);
  }, []);

  const login = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    setUser({ email, token });
  };

  const adminLogin = (token, username) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('username', username);
    setAdmin({ username, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('username');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, login, adminLogin, logout, adminLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
