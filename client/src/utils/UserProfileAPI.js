import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const updateUser = async (requestData, csrfToken) => {
    try {
        const response = await api.put("/api/users/updateUserProfileDetails", requestData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating profile:", error);
        throw error;
    }
};

export const deleteAccount = async (csrfToken) => {
    try {
        const response = await api.delete("/api/users/deleteAccount", {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error Deleting profile:", error);
        throw error;
    }
};

export const resetPassword = async (requestData, csrfToken) => {
    try {
        const response = await api.put("/api/users/resetPassword", requestData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating password:", error);
        throw error;
    }
};

export const biddingHistory = async (csrfToken) => {
    try {
        const response = await api.post("/api/users/getUserBiddingHistory", {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting Bidding History profile:", error);
        throw error;
    }
};

export const userProfileDetails = async (csrfToken) => {
    try {
        const response = await api.post("/api/users/getUserProfileDetails", {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });

        return response;
    } catch (error) {
        console.error("Error getting User Profile:", error);
        throw error;
    }
};

export const userSellingHistory = async (csrfToken) => {
    try {
        const response = await api.post("/api/users/getUserSellingHistory", {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting Selling History:", error);
        throw error;
    }
};

export const userSellCarRequests = async (csrfToken) => {
    try {
        const response = await api.post("/api/users/getUserSellCarRequests", {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting User Sell Car Requests:", error);
        throw error;
    }
};

export const viewUser = async (userID) => {
    try {
        const response = await api.get("/api/users/viewUser" + userID, {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting User Sell Car Requests:", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get("/api/users/getAllUsers", {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting User Sell Car Requests:", error);
        throw error;
    }
};

export const deleteUser = async (userID) => {
    try {
        const response = await api.delete("/api/users/deleteUser" + userID, {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting User Sell Car Requests:", error);
        throw error;
    }
};