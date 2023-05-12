import React, { useState, useEffect, useContext } from "react";
import CreateNote from "../pages/CreateNote";
import ImgList from "./ImgList";
import ReactDOM, { createPortal } from "react-dom";
import MessageView from "../pages/MessageView";
import IFrame from "./IFrame";
import jwt_decode from "jwt-decode";

const Image = ({ onStateChange, componentChange }) => {
  const [showComponent, setShowComponent] = useState(true);
  const [active, setActive] = useState(true);
  const [image, setImage] = useState();
  const [images, setImages] = useState();
  const [lastImage, setLastImage] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [cancel, setCancel] = useState(false);
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
  //   ReactDOM.render(
  //     <ImgList imageUrl={imageSrc}></ImgList>,
  //     iframe.contentWindow.document.getElementById("myList")
  //   );

  useEffect(() => {
    iframe.contentWindow.postMessage({ authTokens, user }, "*");
    if (lastImage) {
      ReactDOM.render(
        <ImgList imageUrls={lastImage}></ImgList>,
        iframe.contentWindow.document.getElementById("myList")
      );
    }
  }, [lastImage]);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    setImage(file);
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      const newImage = event.target.result;
      setLastImage(newImage);
    };

    reader.readAsDataURL(file);
  }

  function saveImg(event) {
    const newImage = imageSrc;
    setImageSrc("");
    setLastImage(newImage);
    setImages((prevImages) => [...prevImages, newImage]);
    iframe.contentWindow.postMessage({ authTokens, user }, "*");
    //ReactDOM.render(<MessageView imageProp={image} />, iframe);
    setAuthTokens(user);
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));

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
      Upload image
      <label class="form-label" for="customFile">
        Default file input example
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        class="form-control"
        id="image"
      />
      {<ImgList imageUrl={imageSrc} />}
      <button type="button" value={false} onClick={saveImg}>
        Save
      </button>
      <button type="button" id="cancel" value={false} onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Image;
