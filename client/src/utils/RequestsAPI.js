import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const viewRequestDetails = async (requestData) => {
    try {
        const response = await api.get("/api/requests/viewRequestDetails/" + requestData, {}, {
        });
        return response;
    } catch (error) {
        console.error("Error Updating History:", error);
        throw error;
    }
};

export const approveRequest = async (requestData) => {
    try {
        const response = await api.post("/api/requests/approveRequest/" + requestData, {}, {
        });
        return response;
    } catch (error) {
        console.error("Error Updating History:", error);
        throw error;
    }
};

export const rejectRequest = async (requestData) => {
    try {
        const response = await api.delete("/api/requests/rejectRequest/" + requestData, {}, {
        });
        return response;
    } catch (error) {
        console.error("Error Updating History:", error);
        throw error;
    }
};

export const getAllRequests = async () => {
    try {
        const response = await api.get("/api/requests/getAllRequests/", {}, {
        });
        return response;
    } catch (error) {
        console.error("Error Updating History:", error);
        throw error;
    }
};
