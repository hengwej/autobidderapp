import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const updateBidHistoryToEnd = async (requestData) => {
    try {
        const response = await api.post("/api/biddingHistory/updateBidHistoryToEnd", requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating History:", error);
        throw error;
    }
};

export const allBidHistory = async (csrfToken) => {
    try {
        const response = await api.get("/api/biddingHistory/allBidHistory", {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching cars:", error);
        throw error;
    }
};

export const addBidHistory = async (requestData, csrfToken) => {
    try {
        const response = await api.post("/api/biddingHistory/addBidHistory", requestData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        });
        return response;
    } catch (error) {
        console.error("Error Adding History:", error);
        throw error;
    }
};
