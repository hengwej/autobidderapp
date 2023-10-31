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

export const allBidHistory = async () => {
    try {
        const response = await api.get("/api/biddingHistory/allBidHistory");
        return response;
    } catch (error) {
        console.error("Error fetching cars:", error);
        throw error;
    }
};

export const addBidHistory = async (requestData) => {
    console.log(requestData);
    console.log("addBidHistory");
    try {
        const response = await api.post("/api/biddingHistory/addBidHistory", requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Adding History:", error);
        throw error;
    }
};
