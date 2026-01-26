import axios from "axios";  

const api = axios.create({
    baseURL: "http://localhost:9090",
});

export const attachTokenInterceptor = (getToken , onLogout) => {
    api.interceptors.request.use((config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401) {
            onLogout();
        }
        return Promise.reject(err);
    }
    );
};

export default api; 