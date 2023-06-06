import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import ButtonComponent from "./ButtonComponent";
import { MDBListGroupItem } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import {
    selectCurrentUser,
  } from "../features/auth/authSlice";
const Button = (  onStateChange,
  componentChange,  contextList) => {
    const { createElement, deleteElement } = useContext(ElementContext);
    const [active, setActive] = useState(true);
    const [text, setText] = useState([]);
    const [link, setLink] = useState([]);
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
              ReactDOM.render(<ButtonComponent text={text} linkValue={link} />, listContainer);
            }, 10);
          }
        }
      }, [text, iframeEl]);

      useEffect(() => {
        setIsMounted(true);
    
        return () => {
          setIsMounted(false);
          setText([]);
          setLink([])
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
    
                // if (listContainer && listContainer.lastElementChild) {
                //   listContainer.removeChild(listContainer.lastElementChild);
                //   // listContainer.current.lastChild.scrollIntoView({
                //   //   behavior: "smooth",
                //   // });
                // }
              }, 10);
            }
          }
        };
      }, []);


      function saveBtn(event) {
        setShowComponent(Boolean(event.target.value));
        setActive(Boolean(!event.target.value));
        // handleText((prevText) => [...prevText, text]);
        //setTexts((prevText) => [...prevText, text]);
        //addTextObjContext();
    
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
        <input type='text' />
        <span>Button link</span>
        <input type='text' />
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
  )
}

export default Button
