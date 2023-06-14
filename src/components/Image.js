import React, { useState, useEffect, useContext } from "react";
import ImgList from "./ImgList";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { ElementContext } from "../context/ElementContext";
import {MDBListGroupItem } from "mdb-react-ui-kit";
import { ImageEditorComponent } from "@syncfusion/ej2-react-image-editor";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
const Image = ({
  onStateChange,
  componentChange,
  handleImages,
  handleFiles,
  contextList,
}) => {
  const { createElement } = useContext(ElementContext);
  const [showComponent, setShowComponent] = useState(true);
  const [active, setActive] = useState(true);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [cancel, setCancel] = useState(false);
  const iframe = document.getElementById("myFrame");
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [isMounted, setIsMounted] = useState(true);
  const iframeEl = document.getElementById("myFrame");
 
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

  let addImageElContext = async (e) => {
    const imageContext = {
      image: URL.createObjectURL(file),
      element_type: "Img",
      users: user,
      file: file,
    };
    createElement(imageContext);
    contextList((prevElement) => [...prevElement, imageContext]);
  };


  function saveImg(event) {
    addImageElContext();
    setCancel(true);
    iframe.contentWindow.postMessage({ token, user }, "*");
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
