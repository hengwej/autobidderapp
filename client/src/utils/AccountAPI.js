import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const allAccount = async () => {
    try {
        const response = await api.get("/api/accounts/allAccount");
        return response;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
};