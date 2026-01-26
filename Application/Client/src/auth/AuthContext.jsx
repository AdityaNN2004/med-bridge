import React from 'react'
import { createContext , useContext , useState } from 'react';


const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    const [token ,setToken] = useState(null);
    const [user , setUser] = useState(null);    

    const login = (jwt , payload) => {

        console.log("AUTH CONTEXT LOGIN CALLED");
        console.log("JWT RECEIVED IN CONTEXT:", jwt);
        console.log("PAYLOAD:", payload);
        setToken(jwt);
        setUser(payload);
    };


    const logout = () => {
        setToken(null);
        setUser(null);
    };

  return (
    <AuthContext.Provider value ={{ token , user , login , logout}}>
      {children}
    </AuthContext.Provider>
  )
}



export const useAuth = () => {
    const context  = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
