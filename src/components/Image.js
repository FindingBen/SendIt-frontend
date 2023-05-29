import React, { useState, useEffect, useContext } from "react";
import ImgList from "./ImgList";
import ReactDOM, { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
const Image = ({
  onStateChange,
  componentChange,
  handleImages,
  listImages,
  handleFiles,
  elementList,
}) => {
  const [showComponent, setShowComponent] = useState(true);
  const [active, setActive] = useState(true);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [cancel, setCancel] = useState(false);
  const iframe = document.getElementById("myFrame");
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [userData, setUserData] = useState();
  const dispatch = useDispatch();
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const userState = localStorage.getItem("authTokens")
    ? jwt_decode(localStorage.getItem("authTokens"))
    : null;

  useEffect(() => {
    iframe.contentWindow.postMessage({ images }, "*");
  }, [images]);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    handleFiles(file);
    setFile(file);

    reader.onload = (event) => {
      setImageSrc(event.target.result);
      const newImage = event.target.result;
      setImages((prevImages) => [...prevImages, newImage]);
      handleImages((prevImages) => [...prevImages, newImage]);
    };

    reader.readAsDataURL(file);
  }

  let addImageElement = async (e) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("element_type", "Img");
    formData.append("users", user);
    let response = await fetch("http://127.0.0.1:8000/api/create_element/", {
      method: "POST",
      headers: {
        //'Content-Type':'application/json',
        Authorization: "Bearer " + String(token),
      },
      body: formData,
    });
    let data = await response.json();
    if (response.status === 200) {
      elementList((prevElement) => [...prevElement, data]);
    }
  };

  function saveImg(event) {
    addImageElement();
    setCancel(true);
    iframe.contentWindow.postMessage({ token, user }, "*");

    // setAuthTokens(user);
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
      {images?.map((image, index) => (
        <ImgList key={index} imageUrl={image} />
      ))}
      <button
        type="button"
        className="btn btn-dark"
        value={false}
        onClick={saveImg}
      >
        Save
      </button>
      <button
        type="button"
        id="cancel"
        className="btn btn-danger"
        value={false}
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default Image;
