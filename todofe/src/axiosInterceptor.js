import axios from "axios";
import { toast } from "react-toastify";

// Create Axios instance
const instance = axios.create({
    baseURL: "http://localhost:3000/api",
});

// Request Interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        toast.error(error.response?.data?.message || "Request failed. Please try again.");
        return Promise.reject(error);
    }
);

// Response Interceptor
instance.interceptors.response.use(
    (response) => {
        // Optionally show success messages
        toast.success(response.data.message || "Request successful!");
        return response;
    },
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login";
            toast.error(error.response?.data?.message || "Unauthorized. Please log in again.");
        } else if (status === 403) {
            toast.error(error.response?.data?.message || "Forbidden. You don't have permission.");
        } else if (status === 404) {
            toast.error(error.response?.data?.message || "Resource not found.");
        } else {
            toast.error(error.response?.data?.message || "An unexpected error occurred.");
        }
        return Promise.reject(error);
    }
);

export default instance;
