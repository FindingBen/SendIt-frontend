import React, { useState, useEffect, useContext } from "react";
import TextComponent from "../components/TextComponent";
import List from "./List";
import ReactDOM, { createPortal } from "react-dom";
import ReactQuill from "react-quill";
import { ElementContext } from "../context/ElementContext";
import "react-quill/dist/quill.snow.css";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
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

const Text = ({
  onStateChange,
  componentChange,
  handleText,
  elementList,
  listEl,
  contextList,
}) => {
  const { createElement, deleteElement } = useContext(ElementContext);
  const [active, setActive] = useState(true);
  const [text, setText] = useState([]);
  const [showComponent, setShowComponent] = useState(true);
  const iframeEl = document.getElementById("myFrame");

  const user = useSelector(selectCurrentUser);
  const [textList, setTextList] = useState([])


  useEffect(() => {
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        setTimeout(() => {
          console.log("TEST")
          ReactDOM.render(
            <MDBListGroupItem>
              {/* {textList?.map((item, index) => (
                <TextComponent key={index} textValue={item} />
              ))} */}
              {text}
            </MDBListGroupItem>,
            listContainer
          );
        }, 10);
      }
    }
  }, [text, iframeEl]);

  // useEffect(() => {
    
  //   return () => {
  //     // Cleanup function
  //     setText([])

  //   //   ReactDOM.render(<MDBListGroupItem id="elItem">
  //   //   <TextComponent textValue={text} />
  //   // </MDBListGroupItem>,iframe.contentDocument.getElementById("myList")); 
  //   };
  // }, []);



  function handleTextFunc(event) {
    setText(event)
    listEl((prevEl) => [...prevEl, event])
  }


  const addTextObjContext = () => {
    const dataText = {
      text: text,
      element_type: "Text",
      users: user,
    };
    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);

  };


  function saveTxt(event) {

    

    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    // handleText((prevText) => [...prevText, text]);
    //setTexts((prevText) => [...prevText, text]);
    addTextObjContext();
    setText('');
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
