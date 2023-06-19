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
  onStateChange,
  componentChange,
  elementList,
  contextList,
  listEl,
  setAlignemnt,
}) => {
  const { createElement, deleteElement } = useContext(ElementContext);
  const [active, setActive] = useState(true);
  const [text, setText] = useState([]);
  const [showComponent, setShowComponent] = useState(true);
  const iframeEl = document.getElementById("myFrame");
  const [isMounted, setIsMounted] = useState(true);
  const user = useSelector(selectCurrentUser);
  const [align, setAlign] = useState();
  const [isCreated, setIsCreated] = useState(listEl);
  useEffect(() => {
    console.log(modules.toolbar[4]);
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        const lastListItem = listContainer.lastChild;
        setTimeout(() => {
          if (!isCreated) {
            ReactDOM.render(
              <TextComponent
                textValue={text}
                alignment={getAlignmentClass(align)}
              />,
              lastListItem
            );
          } else {
            ReactDOM.render(
              <TextComponent
                textValue={text}
                alignment={getAlignmentClass(align)}
              />,
              listContainer
            );
          }
        }, 10);
      }
    }
  }, [text, iframeEl]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      //setIsMounted(false);
      setText([]);
      if (isMounted && iframeEl) {
        const iframeDocument = iframeEl.contentDocument;
        if (iframeDocument) {
          const listContainer = iframeDocument.getElementById("myList");
          const lastListItem = listContainer.lastChild;
          setTimeout(() => {
            if (!isCreated) {
              ReactDOM.render(<></>, lastListItem);
            } else {
              ReactDOM.render(
                <MDBListGroupItem></MDBListGroupItem>,
                listContainer
              );
            }
          }, 10);
        }
      }
    };
  }, []);

  function handleTextFunc(event) {
    setText(event);
    setAlign(event);
    getAlignmentClass(event);
    console.log(align);
  }

  const getAlignmentClass = () => {
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
      text: text,
      alignment: getAlignmentClass(),
      element_type: "Text",
      users: user,
    };
    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    //setElements((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  function saveTxt(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    addTextObjContext();
    setAlign(event);
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
    if (isMounted && iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");

        if (!isCreated) {
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

        if (!isCreated) {
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
