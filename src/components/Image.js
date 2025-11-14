import React, { useState, useEffect, useContext, memo } from "react";
import ImgList from "./ImgList";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";

const Image = ({
  setComponentState,
  handleImages,
  handleFiles,
  contextList,
  elementList,
  listEl,
  imageState,
  stepList,
}) => {
  const { currentUser } = useRedux();
  const { createElement } = useContext(ElementContext);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [cancel, setCancel] = useState(false);
  const { v4: uuidv4 } = require("uuid");
  const [isMounted, setIsMounted] = useState(true);
  const container = document.getElementById("myList");
  const [isCreated, setIsCreated] = useState(listEl);

  useEffect(() => {
    if (container) {
      const lastListItem = container.lastChild;

      if (!isCreated) {
        ReactDOM.render(<ImgList imageUrl={imageSrc} />, lastListItem);
      } else {
        ReactDOM.render(<ImgList imageUrl={imageSrc} />, container);
      }
    }
  }, [imageSrc, container]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setImages([]);
      if (isMounted && container) {
        const lastListItem = container?.lastChild;

        if (!isCreated) {
          ReactDOM.render(<></>, lastListItem);
        } else {
          ReactDOM.render(<li></li>, container);
        }
      }
    };
  }, []);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    handleFiles(file);
    setFile(file);
    imageState(true);
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
      id: Math.floor(Math.random() * 1000000),
      unique_button_id: uuidv4(),
      image: URL.createObjectURL(file),
      element_type: "Img",
      users: currentUser,
      file: file,
      order: 0,
      context: true,
    };
    createElement(imageContext);
    contextList((prevElement) => [...prevElement, imageContext]);
    elementList((prevElement) => [...prevElement, imageContext]);
    //stepList((prevElement) => [...prevElement, imageContext]);
  };

  function saveImg(event) {
    addImageElContext();
    setCancel(true);
    setComponentState(null);
    imageState(false);
    if (isMounted && container) {
      if (!isCreated) {
        if (container) {
          const listItems = Array.from(container?.children);
          listItems?.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              // The element is empty
              // Perform your logic here
              container?.removeChild(listItem);
            }
          });
        }
      }
    }
  }

  function handleCancel(event) {
    setCancel(true);
    setComponentState(null);
    imageState(false);
    if (isMounted) {
      const listContainer = document.getElementById("myList");
      if (!isCreated) {
        if (listContainer) {
          const listItems = Array.from(listContainer?.children);
          listItems?.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              // The element is empty
              // Perform your logic here
              listContainer?.removeChild(listItem);
            }
          });
        }
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0, 0.41, 0.1, 1.01] }}
      className="flex flex-col gap-3 w-full max-w-md mx-auto"
    >
      <label
        htmlFor="image"
        className="block text-gray-100 font-semibold text-sm"
      >
        Upload Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        id="image"
        className="w-full p-2 bg-white/10 border-2 border-gray-600 rounded-lg text-gray-100 text-sm hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={saveImg}
          disabled={!file}
          className={`flex-1 py-2 rounded-lg font-normal border-2 border-gray-800 text-white transition-colors duration-200 ${
            !file
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-500"
          }`}
        >
          Save
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-2 rounded-lg font-normal border-2 border-gray-800 bg-red-700 text-white hover:bg-red-600 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default memo(Image);
