import React, { useState, useEffect, useContext, memo } from "react";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import ButtonComponent from "./ButtonComponent";
import { motion } from "framer-motion";
import ColorPircker from "./ColorPircker";
import { useRedux } from "../constants/reduxImports";

const Button = ({ setComponentState, contextList, elementList, listEl }) => {
  const { currentUser } = useRedux();
  const { createElement, deleteElement } = useContext(ElementContext);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const container = document.getElementById("myList");
  const [isMounted, setIsMounted] = useState(true);
  const [color, setColor] = useState("#000000");
  const [isCreated, setIsCreated] = useState(listEl);
  useEffect(() => {
    try {
      const lastListItem = container?.lastChild;

      if (!isCreated) {
        ReactDOM.render(
          <ButtonComponent
            textValue={text}
            linkValue={link}
            colorValue={`#${color}`}
          />,
          lastListItem
        );
      } else {
        ReactDOM.render(
          <ButtonComponent
            textValue={text}
            linkValue={link}
            colorValue={`#${color}`}
          />,
          container
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [text, link, color, container]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setText([]);
      setLink([]);
      setColor([]);
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

  function handleTextButtonFunc(event) {
    setText(event.target.value);
  }

  function handleLinkButtonFunc(event) {
    setLink(event.target.value);
  }

  const handleColor = (color) => {
    setColor(color);
  };

  const addButtonObjContext = () => {
    const dataText = {
      id: Math.floor(Math.random() * 100),
      button_title: text,
      button_link: link,
      button_color: color,
      element_type: "Button",
      users: currentUser,
      order: 0,
      context: true,
    };

    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  function saveBtn(event) {
    setComponentState(null);
    addButtonObjContext();
    if (isMounted) {
      const container = document.getElementById("myList");
      if (!isCreated) {
        const listItems = Array.from(container?.children);
        listItems.forEach((listItem) => {
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
      <div className="flex-1">
        <label
          for="first_name"
          className="block mb-2 text-normal font-semibold text-grayWhite"
        >
          Button text display
        </label>
        <input
          onChange={handleTextButtonFunc}
          type="text"
          className="bg-white/20 border-1 border-gray-200 text-gray-200 text-sm rounded-lg w-full p-2"
        />
        <label
          for="first_name"
          className="block mb-2 text-normal font-semibold text-grayWhite"
        >
          Insert link
        </label>
        <input
          onChange={handleLinkButtonFunc}
          type="link"
          className="bg-white/20 border-1 border-gray-200 text-gray-200 text-sm rounded-lg w-full p-2"
        />
        <div className="mt-3 flex flex-row relative">
          <button
            type="button"
            className="bg-green-800 hover:bg-green-400 text-white font-semibold py-1 px-2 border-2 border-gray-800 rounded"
            value={false}
            onClick={saveBtn}
            style={{ marginRight: "10px" }}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-red-800 hover:bg-red-400 text-white font-semibold py-1 px-2 border-2 border-gray-800 rounded"
            id="cancel"
            value={false}
            onClick={handleCancel}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </button>
          <div className="absolute top-0 right-0">
            <ColorPircker colorValue={handleColor} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(Button);
