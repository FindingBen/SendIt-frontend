import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
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
  // let [authTokens, setAuthTokens] = useState(() =>
  //   localStorage.getItem("authTokens")
  //     ? JSON.parse(localStorage.getItem("authTokens"))
  //     : null
  // );
  // let [user, setUser] = useState(() =>
  //   localStorage.getItem("authTokens")
  //     ? jwt_decode(localStorage.getItem("authTokens"))
  //     : null
  // );
  //let { authTokens, user } = useContext(AuthContext) ?? {};
  //create an api that calls draft function from backend

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
