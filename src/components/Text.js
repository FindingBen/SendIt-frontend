import React, { useState, useEffect, useContext, memo } from "react";
import TextComponent from "../components/TextComponent";
import ReactDOM from "react-dom";
import ReactQuill from "react-quill";
import { ElementContext } from "../context/ElementContext";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: [] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "video"],
  ],
};

const Text = ({
  setComponentState,
  elementList,
  contextList,
  listEl,
  setAlignemnt,
  stepList,
}) => {
  const { currentUser } = useRedux();
  const { createElement } = useContext(ElementContext);
  const [text, setText] = useState([]);
  const container = document.getElementById("myList");
  const [isMounted, setIsMounted] = useState(true);
  const { v4: uuidv4 } = require("uuid");
  const [align, setAlign] = useState();
  const [isCreated, setIsCreated] = useState(listEl);

  useEffect(() => {
    try {
      const lastListItem = container.lastChild;

      if (!isCreated) {
        ReactDOM.render(
          <TextComponent
            textValue={text}
            alignment={getAlignmentclassName(align)}
          />,
          lastListItem
        );
      } else {
        ReactDOM.render(
          <TextComponent
            textValue={text}
            alignment={getAlignmentclassName(align)}
          />,
          container
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [text, container]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setText([]);
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
        console.error(error);
      }
    };
  }, []);

  function handleTextFunc(event) {
    setText(event);
    setAlign(event);
    getAlignmentclassName(event);
  }

  const getAlignmentclassName = () => {
    if (align && align.includes("ql-align-center")) {
      return "center";
    } else if (align && align.includes("ql-align-right")) {
      return "right";
    } else {
      return "left";
    }
  };

  const addTextObjContext = () => {
    const dataText = {
      unique_button_id: uuidv4(),
      text: text,
      alignment: getAlignmentclassName(),
      element_type: "Text",
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

  function saveTxt(event) {
    setComponentState(null);
    addTextObjContext();
    setAlign(event);
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

  function handleCancel(event) {
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
      className="w-[400px] 2xl:max-w-[550px] h-[150px]"
    >
      <ReactQuill
        className="editor-input h-[100%] lg:h-[300px] overflow-auto bg-white rounded-lg"
        theme="snow"
        value={text}
        onChange={handleTextFunc}
        modules={modules}
      />
      <div className="mt-3">
        <button
          type="button"
          className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold py-2 px-4 border rounded"
          value={false}
          onClick={saveTxt}
          style={{ marginRight: "10px" }}
          disabled={text.length <= 0}
        >
          Save
        </button>
        <button
          type="button"
          className="bg-red-800 hover:bg-red-400 text-white font-bold py-2 px-4 border rounded"
          id="cancel"
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

export default memo(Text);
