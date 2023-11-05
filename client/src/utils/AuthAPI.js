import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});


export const signup = async (accountData, userData) => {
    try {
        const response = await api.post("/api/auth/signup", {
            accountData: accountData,
            userData: userData
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        const response = await api.post("/api/auth/login", {
            username,
            password
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const otp = async (otp, csrfToken) => {
    try {
        const response = await api.post("/api/auth/otp", {
            otp: otp
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const logout = async (csrfToken) => {
    try {
        // Send a POST request to the /logout endpoint
        const response = await api.post("/api/auth/logout", {}, {
            headers: {
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        // Log any errors to the console
        throw error;
    }
};

export const user = async () => {
    try {
        const response = await api.get("/api/auth/user");
        return response;
    } catch (error) {
        throw error;
    }
}

export const refreshCSRFToken = async () => {
    try {
        const response = await api.post("/api/auth/refreshCSRFToken");
        return response;
    } catch (error) {
        throw error;
    }
}
// Export other API functions as needed
