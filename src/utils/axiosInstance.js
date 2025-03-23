import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { setCredentials, logOut } from "../redux/reducers/authSlice";
import { useRef, useState, useEffect } from "react";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";
import { cleanContactLists } from "../redux/reducers/contactListReducer";
import { cleanPackage } from "../redux/reducers/packageReducer";
import { clearMessages } from "../redux/reducers/messageReducer";
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";

const shopifyConfig = {
  apiKey: "537514fd5c87b791b2959cfe452a10ea",
  host: new URLSearchParams(window.location.search).get("host"),
  forceRedirect: true,
};

const app = createApp(shopifyConfig);

const useAxiosInstance = () => {
  const { dispatch } = useRedux();
  const baseURL = config.url.BASE_URL;
  const axiosInstanceRef = useRef(null);
  const [axiosReady, setAxiosReady] = useState(false);
  const createAxiosInstance = (token) => {
    return axios.create({
      baseURL: baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const fetchShopifyToken = async () => {
    try {
      return await getSessionToken(app);
    } catch (error) {
      console.error("Error fetching session token:", error);
      return null;
    }
  };

  useEffect(() => {
    const setupAxios = async () => {
      const token = await fetchShopifyToken();
      if (token) {
        axiosInstanceRef.current = createAxiosInstance(token);
        setAxiosReady(true);
      } else {
        dispatch(logOut());
        dispatch(cleanContactLists());
        dispatch(cleanPackage());
        dispatch(clearMessages());
      }
    };

    setupAxios();
  }, []);


  useEffect(() => {
    if (!axiosInstanceRef.current) return;

    axiosInstanceRef.current.interceptors.request.use(async (req) => {
      const token = await fetchShopifyToken();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    });
  }, [axiosReady]);

  return axiosInstanceRef.current;
};

export default useAxiosInstance;
