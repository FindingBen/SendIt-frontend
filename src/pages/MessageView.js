import React, { useState, useEffect, memo } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import List from "../components/List";
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
  //const BASE_URL = config.url.BASE_URL;

  const BASE_URL =
    "https://sendit-frontend-production.up.railway.app/message_view";

  useEffect(() => {
    messageView();
  }, []);
  console.log(elements);
  let messageView = async () => {
    setId(params.id);
    //https://stingray-app-9825w.ondigitalocean.app
    let response = await fetch(`${BASE_URL}/api/message_view/${params.id}/`, {
      method: "GET",
    });
    //console.log(response);
    const data = await response.json();

    setElements(data?.element_list);
    setIsLoaded(false);
  };

  return (
    <section className="min-h-screen bg-slate-400 flex-d w-100 items-center justify-center">
      <div className="flex flex-col items-stretch">
        <div className="mx-4">
          <List children={elements} style={{ width: "100%" }}></List>
        </div>
      </div>
    </section>
  );
};

export default MessageView;
