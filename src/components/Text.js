import React, { useState, useEffect, useContext } from "react";
import TextComponent from "../components/TextComponent";
import ReactDOM, { createPortal } from "react-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
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
  listTexts,
}) => {
  const [active, setActive] = useState(true);
  const [cancel, setCancel] = useState(false);
  const [texts, setTexts] = useState([]);
  const [text, setText] = useState();
  const [showComponent, setShowComponent] = useState(true);
  const iframe = document.getElementById("myFrame");
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  // const [authTokens, setAuthTokens] = useState(() =>
  //   localStorage.getItem("authTokens")
  //     ? JSON.parse(localStorage.getItem("authTokens"))
  //     : null
  // );
  // const [user, setUser] = useState(() =>
  //   localStorage.getItem("authTokens")
  //     ? jwt_decode(localStorage.getItem("authTokens"))
  //     : null
  // );

  useEffect(() => {
    iframe.contentWindow.postMessage({ texts }, "*");
  }, [listTexts]);

  function handleTextFunc(event) {
    setText(event.target.value);
  }

  let addTextElement = async (e) => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("element_type", "Text");
    formData.append("users", user);
    let response = await fetch("http://127.0.0.1:8000/api/create_element/", {
      method: "POST",
      headers: {
        //'Content-Type':'application/json',
        Authorization: "Bearer " + String(token),
      },
      body: formData,
    });
    let data = await response.json();
    if (response.status === 200) {
      elementList((prevElement) => [...prevElement, data]);
    }
  };

  function saveTxt(event) {
    iframe.contentWindow.postMessage({ token, user }, "*");
    //ReactDOM.render(<MessageView imageProp={image} />, iframe);
    // setAuthTokens(user);
    setShowComponent(Boolean(event.target.value));
    setActive(Boolean(!event.target.value));
    handleText((prevText) => [...prevText, text]);
    setTexts((prevText) => [...prevText, text]);
    addTextElement();

    componentChange(Boolean(!event.target.value));
    onStateChange(Boolean(!event.target.value));
  }

  function handleCancel(event) {
    setCancel(true);
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
        onChange={setText}
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
