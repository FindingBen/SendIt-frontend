import React, { useContext, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { AiFillPicture } from "react-icons/ai";
import Image from "../components/Image";
import Text from "../components/Text";
import TextComponent from "../components/TextComponent";
import ImgList from "../components/ImgList";
import IFrame from "../components/IFrame";
import { useEffect } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import modalReducer, { setModalState } from "../features/modal/modalReducer";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import ButtonComponent from "../components/ButtonComponent";

const EditMessage = () => {
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [active, setActive] = useState(false);
  const [activeT, setActiveT] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [elements, setElements] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  let BASE_URL = "http://127.0.0.1:8000";
  const params = useParams();

  useEffect(() => {
    // setTimeout(() => messageView(), 2000);
    // loadElements()
    messageView();
    dispatch(setModalState({ show: false }));
  }, [isLoaded]);

  const handleClickImage = (e) => {
    e.preventDefault();
    setActive(!active);
    setShowComponent(!showComponent);
  };

  const handleClickText = (e) => {
    e.preventDefault();
    setActiveT(!activeT);
    setShowComponent(!showComponent);
  };

  let messageView = async () => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/message_view/${params.id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    let data = await response.json();
    setElements(data.element_list);
    setIsLoaded(false);
  };

  // let editMessage = async (e) => {
  //   e.preventDefault();
  //   const requestData = {
  //     element_list: elements,
  //   };
  //   console.log(elements);
  //   let response = await fetch(
  //     `http://127.0.0.1:8000/api/message_view_edit/${params.id}/`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         //"Content-Type": "application/json",
  //         Authorization: "Bearer " + String(authTokens.access),
  //       },
  //       body: JSON.stringify(requestData),
  //     }
  //   );
  //   let data = await response.json();
  //   console.log(data);
  //   if (response.status === 200) {
  //     navigate("*");
  //   }
  // };

  const handleElements = (element) => {
    setElements(element);
  };

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

  const handleText = (texts) => {
    setTexts(texts);
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
              <h2>View and Edit message</h2>
              <hr></hr>
            </div>
            <div className="col">
              <MDBListGroup style={{ minWidthL: "22rem" }}>
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
                      elementList={handleElements}
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
                      handleText={handleText}
                      onStateChange={handleTextStateChange}
                      componentChange={handleComponentChange}
                      elementList={handleElements}
                      listTexts={texts}
                    ></Text>
                  )
                )}
              </MDBListGroup>
            </div>
            <div className="col">
              <div class="smartphone">
                <IFrame>
                  {isLoaded ? (
                    /* Render the loading circle or spinner */
                    <div className="spinner-grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <MDBListGroup
                      style={{ minWidthL: "22rem" }}
                      light
                      id="myList"
                    >
                      {elements?.map((item, index) => (
                        <MDBListGroupItem id="elItem" key={index}>
                          {item.element_type === "Img" ? (
                            <ImgList imageUrl={`${BASE_URL + item.image}`} />
                          ) : (
                            <TextComponent textValue={item.text} />
                          )}
                        </MDBListGroupItem>
                      ))}
                    </MDBListGroup>
                  )}
                </IFrame>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="buttonHolder" className="col">
              <button
                type="submit"
                // onClick={editMessage}
                className="btn btn-dark"
              >
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
