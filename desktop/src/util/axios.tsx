import axios from "axios";

export const client = axios.create({
    // Docker
    baseURL: "http://localhost:5000",
    timeout: 10000
})

export const setAuthHeader = (token: string) => {
    client.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
}