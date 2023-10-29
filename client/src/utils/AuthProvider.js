import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from './AuthAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [csrfToken, setCsrfToken] = useState(null);

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

    const refreshCSRFToken = async () => {
        try {
            const response = await api.refreshCSRFToken();
            if (response.status === 200) {
                setCsrfToken(response.data.csrfToken);
            }
        } catch (error) {
            console.error('Failed to refresh CSRF token', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await refreshCSRFToken();
            await fetchUser();
        };

        fetchData();
    }, []);  // Runs once on component mount


    const login = async (Code2FA) => {
        try {
            // Send a POST request to the /otp endpoint with the CSRF token in the headers
            const response = await api.otp(Code2FA);
            // If the response is successful (status code 200), update the CSRF token and user state
            if (response.status === 200) {
                setCsrfToken(response.data.csrfToken);
                setUser({ accountType: response.data.accountType });
            }
            return response;
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    const logout = async () => {
        try {
            // Send a POST request to the /logout endpoint with the CSRF token in the headers
            const response = await api.logout({ csrfToken });
            // Redirect the user to the home page
            window.location.href = '/';
        } catch (error) {
            console.error("Failed to logout:", error);
        }
        setUser(null);
    };

    const value = { user, login, logout, csrfToken };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
