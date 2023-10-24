import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const updateUser = async (requestData) => {
    try {
        const response = await api.put("/api/users/updateUserProfileDetails", requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating profile:", error);
        throw error;
    }
};

export const deleteUser = async (requestData) => {
    try {
        const response = await api.put("/api/users/updateUserProfileDetails", requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating profile:", error);
        throw error;
    }
};

export const biddingHistory = async () => {
    try {
        const response = await api.post("/api/users/getUserBiddingHistory", {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating profile:", error);
        throw error;
    }
};

export const userProfileDetails = async () => {
    try {
        const response = await api.post("/api/users/getUserProfileDetails", {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating profile:", error);
        throw error;
    }
};

export const userSellingHistory = async () => {
    try {
        const response = await api.post("/api/users/getUserSellingHistory", {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating profile:", error);
        throw error;
    }
};