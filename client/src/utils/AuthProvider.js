import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as api from './AuthAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await api.user();

            if (response.status === 200) {
                setUser({ accountType: response.data.accountType });
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async () => {
        // Since the token is set in an HTTP-only cookie, just fetch user data
        await fetchUser();
    };

    const logout = async () => {
        // Add logic here to clear the token on the server, if necessary
        try {
            const response = await api.logout();
            console.log(response.data.message);
            window.location.href = '/';
        } catch (error) {
            console.error("Failed to logout:", error);
        }
        setUser(null);
    };

    const value = { user, login, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
