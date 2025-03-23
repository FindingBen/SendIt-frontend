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
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";

const shopifyConfig = {
  apiKey: "YOUR_SHOPIFY_API_KEY",
  host: new URLSearchParams(window.location.search).get("host"),
  forceRedirect: true,
};

const app = createApp(shopifyConfig);

const useAxiosInstance = () => {
  const { dispatch } = useRedux();
  const baseURL = config.url.BASE_URL;

  const createAxiosInstance = (token) => {
    const instance = axios.create({
      baseURL: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return instance;
  };

  const axiosInstanceRef = useRef(null);

  const setupAxios = async () => {
    try {
      const token = await getSessionToken(app); // Fetch Shopify session token
      axiosInstanceRef.current = createAxiosInstance(token);
    } catch (error) {
      dispatch(logOut());
      dispatch(cleanContactLists());
      dispatch(cleanPackage());
      dispatch(clearMessages());
    }
  };

  if (!axiosInstanceRef.current) {
    setupAxios();
  }

  axiosInstanceRef.current?.interceptors.request.use(async (req) => {
    try {
      const token = await getSessionToken(app);
      req.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      dispatch(logOut());
      dispatch(cleanContactLists());
      dispatch(cleanPackage());
      dispatch(clearMessages());
    }
    return req;
  });

  return axiosInstanceRef.current;
};

export default useAxiosInstance;
