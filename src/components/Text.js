import React, { useState, useEffect, useContext, memo } from "react";
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
    if (iframeEl) {
      const iframeDocument = iframeEl?.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument?.getElementById("myList");
        const lastListItem = listContainer?.lastChild;
        setTimeout(() => {
          if (!isCreated) {
            ReactDOM?.render(
              <TextComponent
                textValue={text}
                alignment={getAlignmentclassName(align)}
              />,
              lastListItem
            );
          } else {
            ReactDOM?.render(
              <TextComponent
                textValue={text}
                alignment={getAlignmentclassName(align)}
              />,
              listContainer
            );
          }
        }, 5);
      }
    }
  }, [text, iframeEl]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      //setIsMounted(false);
      setText([]);
      if (isMounted && iframeEl) {
        const iframeDocument = iframeEl?.contentDocument;
        if (iframeDocument) {
          const listContainer = iframeDocument?.getElementById("myList");
          const lastListItem = listContainer?.lastChild;
          setTimeout(() => {
            if (!isCreated) {
              ReactDOM.render(<></>, lastListItem);
            } else {
              ReactDOM.render(
                <MDBListGroupItem></MDBListGroupItem>,
                listContainer
              );
            }
          }, 5);
        }
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
      text: text,
      alignment: getAlignmentclassName(),
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
      const iframeDocument = iframeEl?.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument?.getElementById("myList");

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
  }

  function handleCancel(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
    if (isMounted && iframeEl) {
      const iframeDocument = iframeEl?.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument?.getElementById("myList");

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
      <div className="mt-3">
        <button
          type="button"
          className="bg-green-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          value={false}
          onClick={saveTxt}
          style={{ marginRight: "10px" }}
        >
          Save
        </button>
        <button
          type="button"
          className="bg-red-800 hover:bg-red-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          id="cancel"
          value={false}
          onClick={handleCancel}
          style={{ marginRight: "10px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default memo(Text);
