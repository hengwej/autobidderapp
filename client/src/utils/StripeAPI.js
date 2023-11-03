import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const createPayment = async (bidValue, csrfToken) => {
    try {
        const response = await api.post("/api/stripe/create-payment-intent", {
            amount: bidValue * 100, // Convert to cents and use bidValue
            currency: 'usd'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            }
        });
        return response;
    } catch (error) {
        console.error("Error Updating History:", error);
        throw error;
    }
};