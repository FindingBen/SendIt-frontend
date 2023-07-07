import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentToken,
  setCredentials,
  logOut,
} from "../features/auth/authSlice";
import { useRef, useEffect } from "react";
import store from "../app/store";

const useAxiosInstance = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector((state) => state.auth.user);

  const createAxiosInstance = (token) => {
    const instance = axios.create({
      baseURL: "http://127.0.0.1:8000/api/",
    });

    // Set the authorization header
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return instance;
  };

  const axiosInstanceRef = useRef(createAxiosInstance(token));

  axiosInstanceRef.current.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;

  axiosInstanceRef.current.interceptors.request.use(async (req) => {
    if (!token) {
      dispatch(logOut(user, token));
      localStorage.removeItem("tokens");
      // Handle the case where the token is not available
      // e.g., redirect the user to the login page
      // or perform other necessary actions
    }

    const isExpired = dayjs.unix(jwt_decode(token).exp).diff(dayjs()) < 1;
    const getRefreshToken = localStorage.getItem("tokens");

    if (!isExpired) return req;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/token/refresh/`,
        {
          refresh: getRefreshToken,
        }
      );
      localStorage.setItem("tokens", response.data.refresh);

      const newToken = response.data.access;

      // Update the axios instance with the new token
      axiosInstanceRef.current = createAxiosInstance(newToken);
      axiosInstanceRef.current.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newToken}`;

      req.headers.Authorization = `Bearer ${newToken}`;
      dispatch(setCredentials({ ...response.data, user }));

      return req;
    } catch (error) {
      // Handle refresh token request error
      // dispatch(logOut()); // Replace with your logout logic
      throw error;
    }
  });

  return axiosInstanceRef.current;
};

export default useAxiosInstance;
