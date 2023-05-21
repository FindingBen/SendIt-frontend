import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import TextComponent from "../components/TextComponent";
import ReactDOM, { createPortal } from "react-dom";

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
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  useEffect(() => {
    iframe.contentWindow.postMessage({ texts }, "*");
    // if (listTexts && listTexts.length > 0) {
    //   ReactDOM.render(
    //     listTexts?.map((text) => {
    //       <li>
    //         <TextComponent key={text} textValue={text} />
    //       </li>;
    //     }),
    //     iframe.contentWindow.document.getElementById("myList")
    //   );
    // } else {
    //   <TextComponent key={0} textValue={text} />;
    // }
  }, [listTexts]);

  function handleTextFunc(event) {
    setText(event.target.value);
  }

  let addTextElement = async (e) => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("element_type", "Text");
    formData.append("users", user.user_id);
    let response = await fetch("http://127.0.0.1:8000/api/create_element/", {
      method: "POST",
      headers: {
        //'Content-Type':'application/json',
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: formData,
    });
    let data = await response.json();
    if (response.status === 200) {
      elementList((prevElement) => [...prevElement, data]);
    }
  };

  function saveTxt(event) {
    iframe.contentWindow.postMessage({ authTokens, user }, "*");
    //ReactDOM.render(<MessageView imageProp={image} />, iframe);
    setAuthTokens(user);
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
      <input value={text} onChange={handleTextFunc}></input>
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
