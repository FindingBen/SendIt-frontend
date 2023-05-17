import React, { useContext, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import { AiFillPicture } from "react-icons/ai";
import Image from "../components/Image";
import Text from "../components/Text";
import TextComponent from "../components/TextComponent";
import ImgList from "../components/ImgList";
import IFrame from "../components/IFrame";
import ReactDOM, { createPortal } from "react-dom";
import { useEffect } from "react";

const EditMessage = () => {
  let { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [active, setActive] = useState(false);
  const [activeT, setActiveT] = useState(false);
  const [items, setItems] = useState();
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [elements, setElements] = useState();
  const imageEL = <ImgList imageUrl={""}></ImgList>;
  const textEl = <TextComponent></TextComponent>;
  let BASE_URL = "http://127.0.0.1:8000";
  const params = useParams();
  useEffect(() => {
    messageView();
  }, []);
  console.log(elements);
  const handleClickImage = (e) => {
    e.preventDefault();
    setActive(!active);
    setShowComponent(!showComponent);
    const iframe = document.getElementById("myFrame");
    const container = iframe.contentWindow.document.createElement("div");
    iframe.contentWindow.document.body.appendChild(container);
    // ReactDOM.render(imageEL, container, () => {
    //   // const list = iframe.contentWindow.document.getElementById("myList");
    //   // const newItem = document.createElement("li");
    //   // newItem.appendChild(container.firstChild);
    //   // list.appendChild(newItem);
    // });
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

  let messageView = async () => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/message_view/${params.id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();
    setElements(data.element_list);
  };

  //   let editMessage = async (e) => {
  //     e.preventDefault();
  //     const formData = new FormData();
  //     formData.append("text", texts);
  //     formData.append("image", file);
  //     formData.append("users", user.user_id);
  //     let response = await fetch(
  //       `http://127.0.0.1:8000/api/message_view/${params}/`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           //"Content-Type": "application/json",
  //           Authorization: "Bearer " + String(authTokens.access),
  //         },
  //         body: formData,
  //       }
  //     );
  //     let data = await response.json();
  //     console.log(data);
  //     if (response.status === 200) {
  //       navigate("*");
  //     }
  //   };
  const handleChildStateChange = (active) => {
    setActive(active);
  };

  const handleTextStateChange = (activeT) => {
    setActiveT(activeT);
  };

  const handleImages = (images) => {
    setImages(images);
  };

  const handleFiles = (file) => {
    setFiles(file);
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
              <h2>Edit message</h2>
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
                      handleFiles={handleFiles}
                      handleImages={handleImages}
                      onStateChange={handleChildStateChange}
                      componentChange={handleComponentChange}
                      listImages={images}
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
                  showComponent &&
                  activeT && (
                    <Text
                      onStateChange={handleTextStateChange}
                      componentChange={handleComponentChange}
                    ></Text>
                  )
                )}
              </ul>
            </div>
            <div className="col">
              <div class="smartphone">
                <IFrame>
                  <ul id="myList">
                    {elements?.map((item, index) => (
                      <li key={index}>
                        {item.element_type == "Img"
                          ? (
                              <img
                                height="150px"
                                src={`${BASE_URL + item.image}`}
                                alt="Italian Trulli"
                              ></img>
                            ) || item.element_type == "text"
                          : item.text}
                      </li>
                    ))}
                  </ul>
                </IFrame>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="buttonHolder" className="col">
              <button type="submit" className="btn btn-dark">
                Edit message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditMessage;
