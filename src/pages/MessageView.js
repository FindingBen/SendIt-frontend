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
import "../css/List.css";
import "../css/MessageView.css";
const MessageView = ({ imageProp, textProp }) => {
  const [elements, setElements] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [getId, setId] = useState();
  const params = useParams();
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const BASE_URL = "https://stingray-app-9825w.ondigitalocean.app";
  //const BASE_URL = "http://localhost:8000";
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
    console.log(data);
    setElements(data?.element_list);
    setIsLoaded(false);
  };

  return (
    <section className="vh-100 mt-2" id="view">
      <List
        children={elements}
        className="my-scroll-list"
        style={{ width: "100%" }}
      ></List>
    </section>
  );
};

export default MessageView;
