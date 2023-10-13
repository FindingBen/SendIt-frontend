import React, { useState, useEffect, memo } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ViewList from "../components/ViewList";
import useAxiosInstance from "../utils/axiosInstance";
import { isMobile, isTablet, isDesktop } from "react-device-detect";
import { config } from "../constants/Constants";

const MessageView = ({ imageProp, textProp }) => {
  const [elements, setElements] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [getId, setId] = useState();
  const params = useParams();
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const BASE_URL = config.url.BASE_URL;

  //const BASE_URL = "https://sendit-backend-production.up.railway.app";

  useEffect(() => {
    messageView();
  }, []);

  let messageView = async () => {
    setId(params.id);
    //https://stingray-app-9825w.ondigitalocean.app
    let response = await fetch(`${BASE_URL}/api/message_view/${params.id}/`, {
      method: "GET",
    });
    //console.log(response);
    const data = await response.json();

    setElements(data);
    setIsLoaded(false);
  };

  return (
    <section className="min-h-screen bg-slate-400 flex-d w-100 items-center justify-center">
      <div className="flex flex-col items-stretch">
        <div className="mx-4">
          <ViewList children={elements} style={{ width: "100%" }}></ViewList>
        </div>
      </div>
    </section>
  );
};

export default MessageView;
