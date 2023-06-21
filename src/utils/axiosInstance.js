import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, setCredentials } from "../features/auth/authSlice";
import store from "../app/store";

const useAxiosInstance = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) =>state.auth.user)
  console.log(jwt_decode(token))
  const createAxiosInstance = (token) => {
    console.log(token)
    const instance = axios.create({
      baseURL: "http://127.0.0.1:8000/api/",
    });
  
    // Set the authorization header
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
    return instance;
  };

  const axiosInstance = createAxiosInstance(token);
  
  axiosInstance.interceptors.request.use(async (req) => {

    if (!token) {
      const currentToken = token
      req.headers.Authorization = `Bearer ${currentToken}`;
      console.log(currentToken)
    }

  
    const isExpired = dayjs.unix(jwt_decode(token).exp).diff(dayjs()) < 1;
    const getRefreshToken = localStorage.getItem('refresh')
    console.log(getRefreshToken)

    if (!isExpired) return req;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/token/refresh/`,
        {
          refresh: getRefreshToken,
        }
        
      );
      
    console.log('Token refreshed:', response.data);

      const newToken = response.data.access;
      console.log(newToken)
      // Update the axios instance with the new token
      createAxiosInstance(newToken);

      req.headers.Authorization = `Bearer ${newToken}`;
      dispatch(setCredentials({ ...response.data,  user }));
      
      return req;
    } catch (error) {
      // Handle refresh token request error
      // dispatch(logOut()); // Replace with your logout logic
      throw error;
    }
  });

  return axiosInstance;
};

export default useAxiosInstance;
