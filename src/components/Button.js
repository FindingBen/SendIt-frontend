import React, { useState, useEffect, useContext } from "react";
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
}) => {
  const { createElement, deleteElement } = useContext(ElementContext);
  const [active, setActive] = useState(true);
  const [text, setText] = useState();
  const [link, setLink] = useState();
  const [showComponent, setShowComponent] = useState(true);
  const iframeEl = document.getElementById("myFrame");
  const [isMounted, setIsMounted] = useState(true);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        setTimeout(() => {
          ReactDOM.render(
            <ButtonComponent linkValue={link} textValue={text} />,
            listContainer
          );
        }, 10);
      }
    }
  }, [text, link, iframeEl]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      setText([]);
      if (isMounted && iframeEl) {
        const iframeDocument = iframeEl.contentDocument;
        if (iframeDocument) {
          const listContainer = iframeDocument.getElementById("myList");
          setTimeout(() => {
            if (listContainer) {
              ReactDOM.render(
                <MDBListGroupItem>{text}</MDBListGroupItem>,
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
    // listEl((prevEl) => [...prevEl, event]);
  }

  function handleLinkButtonFunc(event) {
    console.log(event);
    setLink(event.target.value);
    // listEl((prevEl) => [...prevEl, event]);
  }

  const addButtonObjContext = () => {
    const dataText = {
      button_title: text,
      button_link: link,
      element_type: "Button",
      users: user,
    };
    console.log(dataText);
    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
  };

  function saveBtn(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    // handleText((prevText) => [...prevText, text]);
    //setTexts((prevText) => [...prevText, text]);
    //addTextObjContext();
    addButtonObjContext();
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
  }

  function handleCancel(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
  }

  return (
    <div>
      <h2>Insert information to your button</h2>
      <span>Button title</span>
      <input onChange={handleTextButtonFunc} type="text" />
      <span>Button link</span>
      <input onChange={handleLinkButtonFunc} type="text" />
      <button
        type="button"
        className="btn btn-dark"
        value={false}
        onClick={saveBtn}
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

export default Button;
