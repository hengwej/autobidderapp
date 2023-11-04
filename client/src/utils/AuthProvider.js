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
            console.error('Failed to refresh');
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
            if (error.response.status === 401) {
                return { status: 401, data: { message: 'Invalid OTP' } };
            } else {
                console.error('Failed to login');
            }
        }
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
            if (error.response.status === 401) {
                return { status: 401, data: { message: 'Invalid username or password' } };
            } else {
                console.error('Failed to login');
            }
        }
    };
    const logout = async () => {
        try {
            // Send a POST request to the /logout endpoint with the CSRF token in the headers
            await api.logout({ csrfToken });
            // Display a browser pop-up notification to confirm the logout
            const userWantsToLogout = window.confirm('Are you sure you want to log out?');
            if (userWantsToLogout) {
                // User clicked "OK," proceed with logout
                window.alert('Logout successful! You will redirected to the homepage.');
                // Redirect the user to the home page
                window.location.href = '/';
                setUser(null);
            } else {
                // User clicked "Cancel," stay on the current page and display message
                window.alert('Logout process cancelled!');
            }
        } catch (error) {
            console.error("Failed to logout");
        }
    };
    const value = { user, login, otp, logout, csrfToken, loading, setUser };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
