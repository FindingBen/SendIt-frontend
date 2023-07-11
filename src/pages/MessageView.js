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
const MessageView = ({ imageProp, textProp }) => {
  const [elements, setElements] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [getId, setId] = useState();
  const params = useParams();
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    messageView();
  }, []);

  let messageView = async () => {
    setId(params.id);
    try {
      let response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/message_view/${params.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      setElements(response?.data?.element_list);
      setIsLoaded(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100 mt-2">
      {/* {!isLoaded ? (
        <div className="spinner-border" id="loader" role="status">
          <span>Loading...</span>
        </div>
      ) : (
        <List children={elements}></List>
      )} */}
      <List children={elements}></List>
    </section>
  );
};

export default MessageView;
