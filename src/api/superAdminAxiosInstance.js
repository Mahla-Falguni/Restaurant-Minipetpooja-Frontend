import axios from "axios";

/*
=========================================================
SUPER ADMIN AXIOS INSTANCE
=========================================================
*/

const superAdminAxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/super-admin",
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