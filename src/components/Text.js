import React, { useState, useEffect, useContext } from "react";
import TextComponent from "../components/TextComponent";
import ReactDOM from "react-dom";
import ReactQuill from "react-quill";
import { ElementContext } from "../context/ElementContext";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import {  MDBListGroupItem } from "mdb-react-ui-kit";
import {
  selectCurrentUser,
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
  listEl,
  contextList,
  elementList
}) => {
  const { createElement, deleteElement } = useContext(ElementContext);
  const [active, setActive] = useState(true);
  const [text, setText] = useState([]);
  const [showComponent, setShowComponent] = useState(true);
  const iframeEl = document.getElementById("myFrame");
  const [isMounted, setIsMounted] = useState(true);
  const user = useSelector(selectCurrentUser);
  const [elements, setElements] = useState(elementList)

  useEffect(() => {
    console.log("STATELIST",elements)
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        setTimeout(() => {
          ReactDOM.render(<TextComponent textValue={text} />, listContainer);
        }, 10);
      }
    }
  }, [text, iframeEl,elementList]);

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
                elementList?.map((element)=>{
                  <MDBListGroupItem>{element}</MDBListGroupItem>
                }),
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
    listEl((prevEl) => [...prevEl, event]);
   
  }

  const addTextObjContext = () => {
    const dataText = {
      text: text,
      element_type: "Text",
      users: user,
    };
    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    setElements((prevElement) => [...prevElement, dataText])
  };

  function saveTxt(event) {
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    addTextObjContext();

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
