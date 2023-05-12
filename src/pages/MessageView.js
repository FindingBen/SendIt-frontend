import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";

const MessageView = ({ imageProp, textProp }) => {
  const [image, setImage] = useState(imageProp);
  const [text, setText] = useState(textProp);
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  //let { authTokens, user } = useContext(AuthContext) ?? {};
  //create an api that calls draft function from backend

  useEffect(() => {
    setImage(imageProp);

    createDraft();
    const receiveMessage = (event) => {
      const { authTokens, user } = event.data;
      setAuthTokens(authTokens);
      setUser(user);
    };
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [imageProp, textProp]);

  let createDraft = async (e) => {
    //e.preventDefault();
    const formData = new FormData();
    formData.append("body", text);
    formData.append("image", imageProp);
    formData.append("users", user.user_id);
    let response = await fetch("http://127.0.0.1:8000/api/create_draft/", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: formData,
    });
    let data = await response.json();
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div>
            <h2>Test</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageView;
