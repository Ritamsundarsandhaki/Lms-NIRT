// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userType, setUserType] = useState(() => localStorage.getItem("userType"));

  const login = (newToken, type) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userType", type);
    setToken(newToken);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setToken(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ token, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
