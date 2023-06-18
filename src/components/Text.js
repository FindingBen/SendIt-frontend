import React, { useState, useEffect, useContext } from "react";
import TextComponent from "../components/TextComponent";
import ReactDOM from "react-dom";
import ReactQuill from "react-quill";
import { ElementContext } from "../context/ElementContext";
import "react-quill/dist/quill.snow.css";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { MDBListGroupItem } from "mdb-react-ui-kit";
import { selectCurrentUser } from "../features/auth/authSlice";
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: [] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    // [
    //   { align: "" },
    //   { align: "center" },
    //   { align: "right" },
    //   { align: "justify" },
    // ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "video"],
  ],
};

const Text = ({ onStateChange, componentChange, elementList, contextList }) => {
  const { createElement, deleteElement } = useContext(ElementContext);
  const [active, setActive] = useState(true);
  const [text, setText] = useState([]);
  const [showComponent, setShowComponent] = useState(true);
  const iframeEl = document.getElementById("myFrame");
  const [isMounted, setIsMounted] = useState(true);
  const user = useSelector(selectCurrentUser);
  const [elements, setElements] = useState([elementList]);

  useEffect(() => {
    console.log("STATELIST", elements);
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        const lastListItem = listContainer.lastChild;
        setTimeout(() => {
          ReactDOM.render(<TextComponent textValue={text} />, lastListItem);
        }, 10);
      }
    }
  }, [text, iframeEl, elements]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      setText([]);
      if (isMounted && iframeEl) {
        const iframeDocument = iframeEl.contentDocument;
        if (iframeDocument) {
          const listContainer = iframeDocument.getElementById("myList");
          const lastListItem = listContainer.lastChild;
          setTimeout(() => {
            ReactDOM.render(<></>, lastListItem);
          }, 10);
          const tempItem = iframeDocument.getElementById("temp");
        }
      }
    };
  }, []);

  function handleTextFunc(event) {
    setText(event);
    //listEl((prevEl) => [...prevEl, event]);
  }

  const addTextObjContext = () => {
    const dataText = {
      text: text,
      element_type: "Text",
      users: user,
    };
    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    setElements((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  function saveTxt(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    addTextObjContext();

    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
    if (isMounted && iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");

        if (listContainer) {
          const listItems = Array.from(listContainer.children);
          listItems.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              // The element is empty
              // Perform your logic here
              listContainer.removeChild(listItem);
            }
          });
        }
      }
    }
  }

  function handleCancel(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
    if (isMounted && iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");

        if (listContainer) {
          const listItems = Array.from(listContainer.children);
          listItems.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              // The element is empty
              // Perform your logic here
              listContainer.removeChild(listItem);
            }
          });
        }
      }
    }
  }
  return (
    <div>
      <ReactQuill
        className="editor-input"
        theme="snow"
        value={text}
        onChange={handleTextFunc}
        modules={modules}
      />
      <button
        type="button"
        className="btn btn-dark"
        value={false}
        onClick={saveTxt}
      >
        Save
      </button>
      <button
        type="button"
        className="btn btn-danger"
        id="cancel"
        value={false}
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default Text;
