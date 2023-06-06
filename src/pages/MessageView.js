import React, { useState, useEffect } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
const MessageView = ({ imageProp, textProp, elements }) => {
  const [image, setImage] = useState(imageProp);
  const [text, setText] = useState(textProp);
  const [user, setUser] = useState();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    setImage(imageProp);

    //createDraft();
    const receiveMessage = (event) => {
      const { token, user } = event.data;

      setUser(user);
    };
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [imageProp, textProp]);

  return <section className="vh-100"></section>;
};

export default MessageView;
