import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const viewRequestDetails = async (requestData, csrfToken) => {
    try {
        const response = await api.get("/api/requests/viewRequestDetails/" + requestData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const approveRequest = async (requestData, csrfToken) => {
    try {
        const response = await api.post("/api/requests/approveRequest/" + requestData, {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const rejectRequest = async (requestData, csrfToken) => {
    try {
        const response = await api.delete("/api/requests/rejectRequest/" + requestData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllRequests = async (csrfToken) => {
    try {
        const response = await api.get("/api/requests/getAllRequests/", {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

