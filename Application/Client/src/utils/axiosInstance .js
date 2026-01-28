import axios from "axios";
import { getToken } from "../utils/jwtUtils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Attach token to EVERY request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); // always fresh
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
