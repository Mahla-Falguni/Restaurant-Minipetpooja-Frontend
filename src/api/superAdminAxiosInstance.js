import axios from "axios";

const superAdminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/super-admin`
    : "http://localhost:5000/api/super-admin",
});

superAdminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("superAdminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default superAdminAxiosInstance;