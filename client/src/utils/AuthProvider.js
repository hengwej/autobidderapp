// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Assume null means not logged in

    const login = (userData) => {
        // Perform login logic here
        // Set user data after login
        setUser(userData);
    };

    const logout = () => {
        // Perform logout logic here
        setUser(null);
    };

    const value = { user, login, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
