import axios from "axios";

export const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

apiInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
