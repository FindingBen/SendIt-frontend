import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { setCredentials, logOut } from "../redux/reducers/authSlice";
import { useRef } from "react";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";

import { cleanPackage } from "../redux/reducers/packageReducer";

const useAxiosInstance = () => {
  const { currentToken, currentUser, dispatch } = useRedux();
  const baseURL = config.url.BASE_URL;

  const createAxiosInstance = (token) => {
    const instance = axios.create({
      baseURL: baseURL,
    });

    if (token) {
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${currentToken}`;
    }

    return instance;
  };

  const axiosInstanceRef = useRef(createAxiosInstance(currentToken));
  const tokenExpiration = dayjs.unix(jwt_decode(currentToken).exp);

  axiosInstanceRef.current.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${currentToken}`;

  axiosInstanceRef.current.interceptors.request.use(async (req) => {
    const now = dayjs();
    const timeUntilExpiration = tokenExpiration.diff(now, "seconds");

    if (timeUntilExpiration < 1 && !req.isTokenRefresh) {
      // Refresh the token if it's about to expire in 5 minutes or less
      const getRefreshToken = localStorage.getItem("refreshToken");

      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: getRefreshToken,
        });

        const newToken = response.data.access;
        console.log("new token aquired..");
        localStorage.setItem("refreshToken", response.data.refresh);

        dispatch(setCredentials({ ...response.data, currentUser }));

        const newAxiosInstance = createAxiosInstance(newToken);
        axiosInstanceRef.current = newAxiosInstance;

        axiosInstanceRef.current.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        //dispatch(setCredentials({ user, access: newToken }));

        req.headers.Authorization = `Bearer ${newToken}`;
        req.isTokenRefresh = true;
      } catch (error) {
        console.log(error);
        localStorage.removeItem("refreshToken");
        dispatch(logOut());

        dispatch(cleanPackage());
        throw error;
      }
    }

    return req;
  });

  return axiosInstanceRef.current;
};

export default useAxiosInstance;
