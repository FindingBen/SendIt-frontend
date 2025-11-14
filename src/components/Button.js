import React, { useState, useEffect, useContext, memo } from "react";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import ButtonComponent from "./ButtonComponent";
import { motion } from "framer-motion";
import ColorPircker from "./ColorPircker";
import { useRedux } from "../constants/reduxImports";

const Button = ({
  setComponentState,
  contextList,
  elementList,
  listEl,
  stepList,
}) => {
  const { currentUser } = useRedux();
  const { createElement, deleteElement } = useContext(ElementContext);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  const container = document.getElementById("myList");
  const [isMounted, setIsMounted] = useState(true);
  const [color, setColor] = useState("#000000");
  const [buttonId, setButtonId] = useState("");
  const { v4: uuidv4 } = require("uuid");

  const [isCreated, setIsCreated] = useState(listEl);

  useEffect(() => {
    try {
      const lastListItem = container?.lastChild;
      const uniqueButtonId = uuidv4();
      setButtonId(uniqueButtonId);
      if (!isCreated) {
        ReactDOM.render(
          <ButtonComponent
            textValue={text}
            linkValue={buttonId}
            colorValue={`#${color}`}
          />,
          lastListItem
        );
      } else {
        ReactDOM.render(
          <ButtonComponent
            textValue={text}
            linkValue={buttonId}
            colorValue={`#${color}`}
          />,
          container
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [text, color, container]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setText([]);
      setLink([]);
      setColor([]);
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
      id: Math.floor(Math.random() * 1000000),
      unique_button_id: buttonId,
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
    //stepList((prevElement) => [...prevElement, dataText]);
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
  <div className="flex-1 flex flex-col gap-4">
    {/* Button Text */}
    <div>
      <label
        htmlFor="button_text"
        className="block mb-2 text-sm font-normal text-gray-100"
      >
        Button Text
      </label>
      <input
        id="button_text"
        type="text"
        onChange={handleTextButtonFunc}
        placeholder="Enter button text"
        className="w-full p-2 rounded-lg bg-white/20 border-2 border-gray-600 text-gray-200 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
      />
    </div>

    {/* Button Link */}
    <div>
      <label
        htmlFor="button_link"
        className="block mb-2 text-sm font-normal text-gray-100"
      >
        Button Link
      </label>
      <input
        id="button_link"
        type="url"
        onChange={handleLinkButtonFunc}
        placeholder="Enter URL"
        className="w-full p-2 rounded-lg bg-white/20 border-2 border-gray-600 text-gray-200 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
      />
    </div>

    {/* Actions */}
    <div className="flex items-center justify-between gap-3 relative mt-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={saveBtn}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg border border-gray-800 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-red-700 hover:bg-red-500 text-white font-semibold rounded-lg border border-gray-800 transition"
        >
          Cancel
        </button>
      </div>

      {/* Color Picker */}
      <div className="absolute top-0 right-0">
        <ColorPircker colorValue={handleColor} />
      </div>
    </div>
  </div>
</motion.div>

  );
};

export default memo(Button);
