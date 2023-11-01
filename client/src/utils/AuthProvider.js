import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from './AuthAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [csrfToken, setCsrfToken] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchUser = async () => {
        try {
            const response = await api.user();
            if (response.status === 200) {
                setUser({ accountType: response.data.accountType });
            }
            return response;
        } catch (error) {
            console.error('Failed to fetch user', error);
            return error.response;
        } finally {
            setLoading(false); // Set loading to false once user is fetched
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
            const response = await fetchUser();
            if (response.status === 200 && response.data.message !== 'Not authenticated') {
                await refreshCSRFToken();
            } else {
                setUser(null);
            }
        };

        fetchData();
    }, []);  // Runs once on component mount



    const otp = async (Code2FA, csrfToken) => {

        try {
            // Send a POST request to the /otp endpoint with the CSRF token in the headers
            const response = await api.otp(Code2FA, csrfToken);
            // If the response is successful (status code 200), update the CSRF token and user state
            if (response.status === 200) {
                setCsrfToken(response.data.csrfToken);
                setUser({ accountType: response.data.accountType });
            }
            return response;
        } catch (error) {
            console.error('Failed to login', error);
        }

        setUser({ accountType: "bidder" });
    };

    const login = async (username, password) => {
        try {
            const response = await api.login(username, password);

            if (response.status === 200) {
                setCsrfToken(response.data.csrfToken);
                document.cookie = `token=${response.data.token}; HttpOnly; Secure; SameSite=None`;
                setUser({ accountType: "preOTP" });


                //setUser({ accountType: response.data.accountType });
            }
            return response;
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    const logout = async () => {
        try {
            // Send a POST request to the /logout endpoint with the CSRF token in the headers
            await api.logout({ csrfToken });
            // Redirect the user to the home page
            window.location.href = '/';
        } catch (error) {
            console.error("Failed to logout:", error);
        }
        setUser(null);
    };

    const value = { user, login, otp, logout, csrfToken, loading };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
