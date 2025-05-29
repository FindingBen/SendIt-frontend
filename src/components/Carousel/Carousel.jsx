import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { ElementContext } from "../../context/ElementContext";
import { useRedux } from "../../constants/reduxImports";
import CarouselComponent from "./CarouselComponent";
const Carousel = ({
  setComponentState,
  listEl,
  contextList,
  elementList,
  productImages,
}) => {
  const { currentUser } = useRedux();
  const { createElement } = useContext(ElementContext);
  const [isCreated, setIsCreated] = useState(listEl);
  const container = document.getElementById("myList");
  const [isMounted, setIsMounted] = useState(true);
  const [buttonId, setButtonId] = useState("");
  const { v4: uuidv4 } = require("uuid");

  const imageSrcArray = Array.isArray(productImages)
    ? productImages.map((img) => img?.node?.src).filter(Boolean)
    : [];
  useEffect(() => {
    try {
      const lastListItem = container?.lastChild;
      const uniqueButtonId = uuidv4();
      setButtonId(uniqueButtonId);
      if (!isCreated) {
        ReactDOM.render(
          <CarouselComponent images={imageSrcArray} />,
          lastListItem
        );
      } else {
        ReactDOM.render(
          <CarouselComponent images={imageSrcArray} />,
          container
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [container]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setButtonId();
      try {
        if (isMounted && container) {
          const lastListItem = container?.lastChild;

          if (!isCreated) {
            ReactDOM.render(<></>, lastListItem);
          } else {
            ReactDOM.render(<li></li>, container);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  const addCarouselObjContext = () => {
    const dataText = {
      id: Math.floor(Math.random() * 1000000),
      unique_button_id: uuidv4(),
      carousel_images: [imageSrcArray],
      element_type: "Carousel",
      users: currentUser,
      order: 0,
      context: true,
    };
    //this creates a context data
    createElement(dataText);
    //this adds data to context el list
    contextList((prevElement) => [...prevElement, dataText]);
    //this makes sure that newly created data is displayed together with old elements
    elementList((prevElement) => [...prevElement, dataText]);
    //stepList((prevElement) => [...prevElement, dataText]);
  };

  function handleCancel(event) {
    setComponentState(null);
    if (isMounted) {
      const container = document.getElementById("myList");
      if (!isCreated) {
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

  function saveImg(event) {
    addCarouselObjContext();
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
        className="block mb-2 text-normal font-semibold text-grayWhite"
        for="file_input"
      >
        Images from shopify
      </label>
      <div className="mt-2">
        <button
          type="button"
          className="bg-cyan-600 hover:bg-cyan-400  text-white font-semibold py-1 px-2 border-2 border-gray-800 rounded-lg"
          value={false}
          onClick={saveImg}
          style={{ marginRight: "10px" }}
          // disabled={file === undefined}
        >
          Save
        </button>
        <button
          type="button"
          id="cancel"
          className="bg-red-800 hover:bg-red-400 text-white font-semibold py-1 px-2 border-2 border-gray-800 rounded-lg"
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

export default Carousel;
