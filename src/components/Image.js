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
}) => {
  const { currentUser } = useRedux();
  const { createElement } = useContext(ElementContext);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [cancel, setCancel] = useState(false);
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
      id: Math.floor(Math.random() * 100),
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
  };

  function saveImg(event) {
    addImageElContext();
    setCancel(true);
    setComponentState(null);
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
    if (isMounted) {
      const listContainer = document.getElementById("myList");
      if (!isCreated) {
        if (listContainer) {
          const listItems = Array.from(listContainer?.children);
          listItems?.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              console.log("EMPTYYYYY");
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
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: [0, 0.41, 0.1, 1.01],
      }}
    >
      <label
        className="block mb-2 text-sm font-light text-grayWhite dark:text-white"
        for="file_input"
      >
        Upload file
      </label>
      {/* <ImageEditorComponent
        //onChange={handleImageUpload}
        created={imageEditorCreated}
      ></ImageEditorComponent> */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="image"
      />

      <div className="mt-2">
        <button
          type="button"
          className={`${
            !file ? "bg-gray-600" : "bg-green-800 hover:bg-green-400"
          }  text-white font-bold py-2 px-4 border border-blue-700 rounded`}
          value={false}
          onClick={saveImg}
          style={{ marginRight: "10px" }}
          disabled={file === undefined}
        >
          Save
        </button>
        <button
          type="button"
          id="cancel"
          className="bg-red-800 hover:bg-red-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          value={false}
          onClick={handleCancel}
          style={{ marginRight: "10px" }}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default memo(Image);
