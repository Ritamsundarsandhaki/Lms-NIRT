import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null);

  const login = (token, type) => {
    setToken(token);
    setUserType(type);
  };

  const logout = () => {
    setToken(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ token, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export useAuth Hook
export const useAuth = () => useContext(AuthContext);
