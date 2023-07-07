import React, { useState, useEffect, useContext, memo } from "react";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import ButtonComponent from "./ButtonComponent";
import { MDBListGroupItem } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
const Button = ({
  onStateChange,
  componentChange,
  contextList,
  elementList,
  listEl,
}) => {
  const { createElement, deleteElement } = useContext(ElementContext);
  const [active, setActive] = useState(true);
  const [text, setText] = useState();
  const [link, setLink] = useState();
  const [showComponent, setShowComponent] = useState(true);
  const iframeEl = document.getElementById("myFrame");
  const [isMounted, setIsMounted] = useState(true);
  const user = useSelector(selectCurrentUser);
  //const [elements, setElements] = useState([elementList]);
  const [isCreated, setIsCreated] = useState(listEl);
  useEffect(() => {
    const iframeDocument = iframeEl.contentDocument;
    if (iframeDocument) {
      const listContainer = iframeDocument.getElementById("myList");
      const lastListItem = listContainer.lastChild;
      setTimeout(() => {
        if (!isCreated) {
          ReactDOM.render(
            <ButtonComponent textValue={text} linkValue={link} />,
            lastListItem
          );
        } else {
          ReactDOM.render(
            <ButtonComponent textValue={text} linkValue={link} />,
            listContainer
          );
        }
      }, 10);
    }
  }, [text, link, iframeEl]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setText([]);
      setLink([]);
      if (isMounted && iframeEl) {
        const iframeDocument = iframeEl.contentDocument;
        if (iframeDocument) {
          const listContainer = iframeDocument.getElementById("myList");
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
          }, 10);
        }
      }
    };
  }, []);

  function handleTextButtonFunc(event) {
    setText(event.target.value);
  }

  function handleLinkButtonFunc(event) {
    setLink(event.target.value);
  }

  const addButtonObjContext = () => {
    const dataText = {
      button_title: text,
      button_link: link,
      element_type: "Button",
      users: user,
    };

    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  function saveBtn(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));

    addButtonObjContext();
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
    if (isMounted && iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");

        if (!isCreated) {
          if (listContainer) {
            const listItems = Array.from(listContainer?.children);
            listItems.forEach((listItem) => {
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

  function handleSaveAndCancel(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        if (!isCreated && listContainer) {
          const listItems = Array.from(listContainer.children);
          listItems.forEach((listItem) => {
            if (listItem.innerHTML.trim() === "") {
              listContainer.removeChild(listItem);
            }
          });
        }
      }
    }
  }

  // // Update the button onClick handlers to use the combined function
  // <button
  //   type="button"
  //   className="btn btn-dark"
  //   value={false}
  //   onClick={handleSaveAndCancel}
  // >
  //   Save
  // </button>
  // <button
  //   type="button"
  //   className="btn btn-danger"
  //   id="cancel"
  //   value={false}
  //   onClick={handleSaveAndCancel}
  // >
  //   Cancel
  // </button>

  return (
    <div>
      <label
        for="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Button text display
      </label>
      <input
        onChange={handleTextButtonFunc}
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <label
        for="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Insert link
      </label>
      <input
        onChange={handleLinkButtonFunc}
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <div className="mt-3">
        <button
          type="button"
          className="bg-green-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          value={false}
          onClick={saveBtn}
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

export default memo(Button);
