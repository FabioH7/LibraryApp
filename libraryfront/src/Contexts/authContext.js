import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
      const getUser = JSON.parse(localStorage.getItem("user"))
      setUser(getUser)
  }, [])
  
    // Function to handle login
    const login = (userData) => {
      setUser(userData.user);
      console.log("userdata", userData)
      console.log("auth", userData)
      localStorage.setItem("token", userData.token)
      localStorage.setItem("user", JSON.stringify(userData.user))
      localStorage.setItem("refresh", userData.refreshToken)
    };
  
    const logout = () => {
      setUser(null);
      localStorage.clear()
    };
  
    const authContextValue = {
      user,
      login,
      logout,
    };
  
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
  };
  
  export { AuthContext, AuthProvider };
