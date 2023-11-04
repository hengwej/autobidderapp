import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const getAllFAQs = async () => {
    try {
        const response = await api.get("/api/FAQ/getAllFAQs");
        return response;
    } catch (error) {
        throw error;
    }
}