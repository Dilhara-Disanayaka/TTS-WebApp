// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true, // needed for cookies
});

let isRefreshing = false;

axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to refresh token if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axiosInstance.get("/api/auth/refresh");
          const newToken = res.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        } catch (e) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login"; // force logout
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
