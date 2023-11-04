import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const getAllCars = async () => {
    try {
        const response = await api.get("/api/cars/allCar");
        return response;
    } catch (error) {
        throw error;
    }
}

export const sellCar = async (data, csrfToken) => {
    try {
        const response = await api.post("/api/cars/sellCar", data, {
            headers: {
                'X-CSRF-Token': csrfToken
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const checkConnection = async (data) => {
    try {
        const response = await api.post("/sellcar", data);
        return response;
    } catch (error) {
        throw error;
    }
}