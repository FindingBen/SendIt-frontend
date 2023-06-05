import React, { useState, useEffect, useContext } from "react";
import ImgList from "./ImgList";
import ReactDOM, { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { ElementContext } from "../context/ElementContext";
import jwt_decode from "jwt-decode";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { ImageEditorComponent } from "@syncfusion/ej2-react-image-editor";
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
  contextList,
}) => {
  const { createElement, deleteElement } = useContext(ElementContext);
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
  const [isMounted, setIsMounted] = useState(true);
  const dispatch = useDispatch();
  const iframeEl = document.getElementById("myFrame");
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const userState = localStorage.getItem("authTokens")
    ? jwt_decode(localStorage.getItem("authTokens"))
    : null;
  const BASE_URL = "http://127.0.0.1:8000/media/";
  useEffect(() => {
    iframe.contentWindow.postMessage({ images }, "*");
  }, [images]);

  useEffect(() => {
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        setTimeout(() => {
          ReactDOM.render(<ImgList imageUrl={imageSrc} />, listContainer);
        }, 10);
      }
    }
  }, [imageSrc, iframeEl]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      setImages([]);
      if (isMounted && iframeEl) {
        const iframeDocument = iframeEl.contentDocument;
        if (iframeDocument) {
          const listContainer = iframeDocument.getElementById("myList");
          setTimeout(() => {
            if (listContainer) {
              ReactDOM.render(
                <MDBListGroupItem>{imageSrc}</MDBListGroupItem>,
                listContainer
              );
            }

            // if (listContainer && listContainer.lastElementChild) {
            //   listContainer.removeChild(listContainer.lastElementChild);
            //   // listContainer.current.lastChild.scrollIntoView({
            //   //   behavior: "smooth",
            //   // });
            // }
          }, 10);
        }
      }
    };
  }, []);

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
  console.log(file);
  let addImageElContext = async (e) => {
    const formData = new FormData();
    const imageContext = {
      image: URL.createObjectURL(file),
      element_type: "Img",
      users: user,
      file: file,
    };
    const data = {
      image: file,
      element_type: "Img",
      users: user,
    };
    createElement(imageContext);
    contextList((prevElement) => [...prevElement, imageContext]);
    //elementList((prevElement) => [...prevElement, data]);
  };

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
      //elementList((prevElement) => [...prevElement, data]);
    }
  };

  function saveImg(event) {
    //addImageElement();
    addImageElContext();
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
      {/* <ImageEditorComponent></ImageEditorComponent> */}
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
