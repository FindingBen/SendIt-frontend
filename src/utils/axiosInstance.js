import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { setCredentials, logOut } from "../redux/reducers/authSlice";
import { useRef } from "react";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";
import { cleanContactLists } from "../redux/reducers/contactListReducer";
import { cleanPackage } from "../redux/reducers/packageReducer";
import { clearMessages } from "../redux/reducers/messageReducer";

const useAxiosInstance = () => {
  const {
    currentToken,
    currentUser,
    currentTokenType,
    dispatch,
    currentDomain,
  } = useRedux();
  const baseURL = config.url.BASE_URL;

  const createAxiosInstance = (token, currentTokenType) => {
    const instance = axios.create({
      baseURL: baseURL,
    });

    if (token) {
      instance.defaults.headers.common["Authorization"] =
        currentTokenType === "JWT" ? `Bearer ${token}` : `Shopify ${token}`;
    }

    return instance;
  };

  const axiosInstanceRef = useRef(
    createAxiosInstance(currentToken, currentTokenType)
  );
  //const tokenExpiration = dayjs.unix(jwt_decode(currentToken).exp);

  axiosInstanceRef.current.interceptors.request.use(async (req) => {
    if (currentTokenType === "JWT") {
      console.log("SDDD");
      const tokenExpiration = dayjs.unix(jwt_decode(currentToken).exp);
      const now = dayjs();
      const timeUntilExpiration = tokenExpiration.diff(now, "seconds");

      if (timeUntilExpiration < 300 && !req.isTokenRefresh) {
        // Refresh JWT token if it's about to expire in 5 minutes
        const getRefreshToken = localStorage.getItem("refreshToken");

        try {
          const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: getRefreshToken,
          });

          const newToken = response.data.access;
          localStorage.setItem("refreshToken", response.data.refresh);

          dispatch(
            setCredentials({
              user: currentUser,
              token: newToken,
              tokenType: "JWT",
            })
          );

          const newAxiosInstance = createAxiosInstance(newToken, "JWT");
          axiosInstanceRef.current = newAxiosInstance;

          req.headers.Authorization = `Bearer ${newToken}`;
          req.isTokenRefresh = true;
        } catch (error) {
          localStorage.removeItem("refreshToken");
          dispatch(logOut());
          dispatch(cleanContactLists());
          dispatch(cleanPackage());
          dispatch(clearMessages());
          throw error;
        }
      }
    } else if (currentTokenType === "Shopify") {

      req.headers.Authorization = `Shopify ${currentToken}`;
      req.headers["shopify-domain"] = currentDomain;
    }

    return req;
  });

  return axiosInstanceRef.current;
};

export default useAxiosInstance;
