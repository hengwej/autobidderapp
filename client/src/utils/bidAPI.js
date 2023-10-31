import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});


export const addBid = async (bidValue, carID) => {
    try {
        const response = await api.post("/api/auctions/addBid",
            { bidValue, carID },
            {
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

export const addOrder = async (requestData) => {
    try {
        const response = await api.put("/api/auctions/addOrder", requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating Order:", error);
        throw error;
    }
};

export const addSellingHistory = async (requestData) => {
    try {
        const response = await api.post("/api/auctions/addSellingHistory", requestData, {
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
