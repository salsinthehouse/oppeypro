import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  // Keep React state in sync if another tab writes the keys
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') setToken(e.newValue);
      if (e.key === 'userType') setUserType(e.newValue);
      if (e.key === 'userName') setUserName(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (newToken, newUserType, newUserName) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userType', newUserType);
    localStorage.setItem('userName', newUserName);
    setToken(newToken);
    setUserType(newUserType);
    setUserName(newUserName);
  };

  const logout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('pkce_verifier');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    
    // Clear React state
    setToken(null);
    setUserType(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userType, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 