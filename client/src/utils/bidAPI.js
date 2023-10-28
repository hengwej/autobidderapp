import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});


export const addBid = async (bidValue, carID) => {
    try {
        const response = await api.post("/api/auctions/addBid",
        {bidValue, carID},
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