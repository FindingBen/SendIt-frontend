import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import { AiFillPicture } from "react-icons/ai";
import Image from "../components/Image";
import Text from "../components/Text";
import ImgList from "../components/ImgList";
import IFrame from "../components/IFrame";

import ReactDOM, { createPortal } from "react-dom";
import { useEffect } from "react";

const CreateNote = () => {
  let { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [active, setActive] = useState(false);
  const [activeT, setActiveT] = useState(false);
  const [items, setItems] = useState();

  const imageEL = <ImgList imageUrl={""}></ImgList>;

  const textEl = <Text></Text>;

  const handleClickImage = (e) => {
    e.preventDefault();
    setActive(!active);
    setShowComponent(!showComponent);
    const iframe = document.getElementById("myFrame");
    const container = iframe.contentWindow.document.createElement("div");
    iframe.contentWindow.document.body.appendChild(container);
    ReactDOM.render(imageEL, container, () => {
      const list = iframe.contentWindow.document.getElementById("myList");
      const newItem = document.createElement("li");
      newItem.appendChild(container.firstChild);
      list.appendChild(newItem);
    });
  };

  const handleClickText = (e) => {
    e.preventDefault();
    setActiveT(!activeT);
    setShowComponent(!showComponent);
    const iframe = document.getElementById("myFrame");
    const container = iframe.contentWindow.document.createElement("div");
    iframe.contentWindow.document.body.appendChild(container);
    ReactDOM.render(textEl, container, () => {
      const list = iframe.contentWindow.document.getElementById("myList");
      const newItem = document.createElement("li");
      newItem.appendChild(container.firstChild);
      list.appendChild(newItem);
    });
  };

  // let createNotes = async (e) => {
  //   e.preventDefault();
  //   let response = await fetch("http://127.0.0.1:8000/api/create_notes/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + String(authTokens.access),
  //     },
  //     body: JSON.stringify({ body: e.target.body.value, users: user.user_id }),
  //   });
  //   if (response.status === 200) {
  //     navigate("*");
  //   }
  // };
  const handleChildStateChange = (active) => {
    setActive(active);
  };

  const handleComponentChange = (showComponent) => {
    setShowComponent(showComponent);
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="row">
            <div className="col-12">
              <h2>Add message</h2>
              <hr></hr>
            </div>
            <div className="col">
              <ul className="list-group list-group-light">
                {!showComponent && !active ? (
                  <li
                    onClick={handleClickImage}
                    name="liClick"
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <AiFillPicture></AiFillPicture>
                    Add image
                  </li>
                ) : (
                  showComponent &&
                  active && (
                    <Image
                      onStateChange={handleChildStateChange}
                      componentChange={handleComponentChange}
                    ></Image>
                  )
                )}
                <hr></hr>
                {!showComponent && !activeT ? (
                  <li
                    onClick={handleClickText}
                    name="liClick"
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <AiFillPicture></AiFillPicture>
                    Add Text
                  </li>
                ) : (
                  showComponent && activeT && <Text></Text>
                )}
              </ul>
            </div>
            <div className="col">
              <div class="smartphone">
                <IFrame>
                  <ul id="myList">
                    {items?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </IFrame>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateNote;
