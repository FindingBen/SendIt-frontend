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

    let response = await fetch(`api/message_view/${params.id}/`);

    //const data = await response.json();
    setElements(response.data?.element_list);
    setIsLoaded(false);
    console.log(response);
    console.log(elements);
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
