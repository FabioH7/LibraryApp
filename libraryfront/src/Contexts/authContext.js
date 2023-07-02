import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const getUser = localStorage.getItem("user")
      setUser(getUser)
  })
  
    // Function to handle login
    const login = (userData) => {
      setUser(userData.user);
      console.log("auth", userData)
      localStorage.setItem("token", userData.token)
      localStorage.setItem("user", JSON.stringify(userData.user))
      localStorage.setItem("refresh", userData.refreshToken)
    };
  
    // Function to handle logout
    const logout = () => {
      setUser(null);
      localStorage.clear()
    };
  
    // Value to be provided by the context
    const authContextValue = {
      user,
      login,
      logout,
    };
  
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
  };
  
  export { AuthContext, AuthProvider };
