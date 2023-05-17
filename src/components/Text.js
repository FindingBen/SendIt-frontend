import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import TextComponent from "../components/TextComponent";

const Text = ({ onStateChange, componentChange }) => {
  const [active, setActive] = useState(true);
  const [cancel, setCancel] = useState(false);
  const [showComponent, setShowComponent] = useState(true);
  const iframe = document.getElementById("myFrame");
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  function saveImg(event) {


    iframe.contentWindow.postMessage({ authTokens, user }, "*");
    //ReactDOM.render(<MessageView imageProp={image} />, iframe);
    setAuthTokens(user);
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    console.log(event);
    //handleImages((prevImages) => [...prevImages, images]);
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
  }

  function handleCancel(event) {
    setCancel(true);
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));

    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
  }
  return (
    <div>
      <TextComponent></TextComponent>
      <button type="button" value={false} onClick={saveImg}>
        Save
      </button>
      <button type="button" id="cancel" value={false} onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Text;
