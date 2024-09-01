import axios from "axios";
import { useAuthStore } from "../store";

const AUTH_SERVICE = "api/auth";
// const CATALOG_SERVICE = "api/catalog";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_SERVER_API_URL}/${AUTH_SERVICE}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orignalRequest = error.config;
    if (error.response.status === 401 && !orignalRequest._isRetry) {
      try {
        orignalRequest._isRetry = true;
        const headers = orignalRequest.headers;
        await refreshToken();
        return api.request({ ...orignalRequest, headers });
      } catch (err) {
        console.error("Token refresh error", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
