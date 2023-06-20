import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { selectCurrentToken, logOut } from "../features/auth/authSlice";

const token = useSelector(selectCurrentToken);

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const get_token = token; // Replace with your token retrieval logic
    if (get_token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = getRefreshTokenFromStore(); // Replace with your refresh token retrieval logic
        if (refreshToken) {
          try {
            const refreshResponse = await api.post("token/refresh/", {
              refresh: refreshToken,
            });
            const { access: newAccessToken } = refreshResponse.data;
            saveTokenToStore(newAccessToken); // Replace with your token storage logic
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Handle refresh token request error
            logoutUser(); // Replace with your logout logic
          }
        } else {
          logoutUser(); // Replace with your logout logic
        }
      } else {
        logoutUser(); // Replace with your logout logic
      }
    }
    return Promise.reject(error);
  }
);
