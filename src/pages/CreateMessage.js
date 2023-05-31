import React, { useContext, useState } from "react";
import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import { AiFillPicture } from "react-icons/ai";
import Image from "../components/Image";
import Text from "../components/Text";
import TextComponent from "../components/TextComponent";
import ImgList from "../components/ImgList";
import Header from "../components/Header";

import IFrame from "../components/IFrame";
import jwt_decode from "jwt-decode";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { useEffect } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { setState } from "../features/modal/formReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const CreateNote = ({ handleNavigation }) => {
  // let { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [active, setActive] = useState(false);
  const [activeT, setActiveT] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [elementsList, setElementsList] = useState([]);
  const params = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  //const modal = useSelector(setModalState);
  useEffect(() => {
    if (elementsList.length > 0) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
  }, [elementsList]);

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

  let createNotes = async (e) => {
    e.preventDefault();
    const requestData = {
      element_list: elementsList,
      users: user,
    };

    let response = await fetch("http://127.0.0.1:8000/api/create_notes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token),
      },
      body: JSON.stringify(requestData),
    });

    let data = await response.json();

    if (response.status === 200) {
      navigate("/home");
    } else {
      console.log("WRONG", data);
    }
  };

  const handleElements = (elementsList) => {
    setElementsList(elementsList);
    setIsDirty(true);
  };

  const handleChildStateChange = (active) => {
    setActive(active);
  };

  const handleTextStateChange = (activeT) => {
    setActiveT(activeT);
  };
  //For displaying images on iframe
  const handleImages = (images) => {
    setImages(images);
  };
  //for creating a message object because it needs a file type not img src
  const handleFiles = (file) => {
    setFiles(file);
  };

  const handleText = (texts) => {
    setTexts(texts);
  };

  const handleComponentChange = (showComponent) => {
    setShowComponent(showComponent);
  };

  const handleModal = (showModal) => {
    setShowModal(showModal);
  };

  let deleteElement = async () => {
    elementsList?.map((element) =>
      fetch(`http://127.0.0.1:8000/api/delete_element/${element.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      })
    );
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <h2>Add message</h2>
              <hr></hr>
            </div>
            <div className="col">
              <MDBListGroup style={{ minWidthL: "22rem" }}>
                {!showComponent && !active ? (
                  <MDBListGroupItem
                    onClick={handleClickImage}
                    name="liClick"
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <AiFillPicture></AiFillPicture>
                    Add image
                  </MDBListGroupItem>
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
                  <MDBListGroupItem
                    onClick={handleClickText}
                    name="liClick"
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <AiFillPicture></AiFillPicture>
                    Add Text
                  </MDBListGroupItem>
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
                  <MDBListGroup
                    style={{ minWidthL: "22rem" }}
                    light
                    id="myList"
                  >
                    {elementsList &&
                      elementsList?.map((item, index) => (
                        <MDBListGroupItem id="elItem" key={index}>
                          {item.element.element_type === "Img" ? (
                            <ImgList
                              imageUrl={`${item.element.image}`}
                              //alt="Italian Trulli"
                            ></ImgList>
                          ) : (
                            <TextComponent
                              textValue={item.element.text}
                            ></TextComponent>
                          )}
                        </MDBListGroupItem>
                      ))}
                  </MDBListGroup>
                </IFrame>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="buttonHolder" className="col">
              <button
                type="submit"
                onClick={createNotes}
                className="btn btn-dark"
              >
                Create message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateNote;
