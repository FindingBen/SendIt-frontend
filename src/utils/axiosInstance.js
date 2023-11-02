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
import { config } from "../constants/Constants";

const useAxiosInstance = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector((state) => state.auth.user);
  const baseURL = config.url.BASE_URL;

  const createAxiosInstance = (token) => {
    const instance = axios.create({
      baseURL: baseURL,
    });

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return instance;
  };

  const axiosInstanceRef = useRef(createAxiosInstance(token));
  const tokenExpiration = dayjs.unix(jwt_decode(token).exp);

  axiosInstanceRef.current.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;

  axiosInstanceRef.current.interceptors.request.use(async (req) => {
    const now = dayjs();
    const timeUntilExpiration = tokenExpiration.diff(now, "minute");

    if (timeUntilExpiration < 5) {
      // Refresh the token if it's about to expire in 5 minutes or less
      const getRefreshToken = localStorage.getItem("token");

      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: getRefreshToken,
        });
        localStorage.setItem("token", response.data.refresh);
        const newToken = response.data.access;
        console.log("new token aquired..");
        axiosInstanceRef.current = createAxiosInstance(newToken);
        axiosInstanceRef.current.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        req.headers.Authorization = `Bearer ${newToken}`;
        dispatch(setCredentials({ ...response.data, user }));
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        dispatch(logOut());
        throw error;
      }
    }

    return req;
  });

  return axiosInstanceRef.current;
};

export default useAxiosInstance;
