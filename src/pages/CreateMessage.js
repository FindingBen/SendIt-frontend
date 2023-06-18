import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import { AiFillPicture } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faFont } from "@fortawesome/free-solid-svg-icons";
import Image from "../components/Image";
import Text from "../components/Text";
import Button from "../components/Button";
import IFrame from "../components/IFrame";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import modalReducer, {
  selectModalCall,
  setOpenModal,
} from "../features/modal/modalReducer";
import List from "../components/List";
import ReactDOM from "react-dom";
import { setState } from "../features/modal/formReducer";
import { setList, selectListState } from "../features/elements/elementReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ElementContext } from "../context/ElementContext";

const CreateNote = () => {
  const { createElement, deleteElement, contextObject } =
    useContext(ElementContext);
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [active, setActive] = useState(false);
  const [activeT, setActiveT] = useState(false);
  const [activeB, setActiveB] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [displayElItem, setDisplayItems] = useState([]);
  const [elementsList, setElementsList] = useState([]);
  const [elementContextList, setElementsContextList] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const modal_state = useSelector(selectModalCall);

  useEffect(() => {
    if (elementContextList.length > 0) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
    dispatch(setOpenModal({ open: false }));
  }, [elementContextList, elementsList, modal_state]);

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

  const handleClickButton = (e) => {
    e.preventDefault();
    setActiveB(!activeB);
    setShowComponent(!showComponent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdElements = await addElement(e); // Store the created elements in a variable
      const requestData = {
        element_list: createdElements, // Map the created elements to their IDs
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
        dispatch(setState({ isDirty: false }));
        navigate("/home");
      } else {
        console.log("Failed to create notes:", data);
      }
    } catch (error) {
      console.log("Error creating elements and notes:", error);
    }
  };

  const addElement = async (e) => {
    e.preventDefault();
    dispatch(setList({ populated: true }));

    try {
      const createdElements = [];

      for (const elementContext of elementContextList) {
        const formData = new FormData();

        // Append the displayItems state to the elementContext
        //elementContext.displayItems = displayItems;

        if (elementContext.element_type === "Img") {
          formData.append("image", elementContext.file);
        } else if (elementContext.element_type === "Text") {
          formData.append("text", elementContext.text);
        } else if (elementContext.element_type === "Button") {
          formData.append("button_title", elementContext.button_title);
          formData.append("button_link", elementContext.button_link);
        }
        formData.append("element_type", elementContext.element_type);
        formData.append("users", elementContext.users);

        let response = await fetch(
          "http://127.0.0.1:8000/api/create_element/",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(token),
            },
            body: formData,
          }
        );

        let data = await response.json();
        console.log(data);
        if (response.status === 200) {
          createdElements.push(data);
        } else {
          console.log("Failed to create element:", elementContext);
          return; // Return undefined to indicate a failure
        }
      }

      setElementsList((prevElement) => prevElement.concat(createdElements));
      return createdElements; // Return the created elements from the function
    } catch (error) {
      console.log("Error creating elements:", error);
      return; // Return undefined to indicate a failure
    }
  };

  const handleContextEl = (elementContextList) => {
    setElementsContextList(elementContextList);
    setIsDirty(true);
  };

  const handleChildStateChange = (active) => {
    setActive(active);
  };

  const handleTextStateChange = (activeT) => {
    setActiveT(activeT);
  };

  const handleButtonStateChange = (activeB) => {
    setActiveB(activeB);
  };
  //For displaying images on iframe
  const handleImages = (images) => {
    setImages(images);
  };
  //for creating a message object because it needs a file type not img src
  const handleFiles = (file) => {
    setFiles(file);
  };

  const displayElements = (displayElItem) => {
    setDisplayItems((prevItems) => [...prevItems, displayElItem]);
  };

  const handleComponentChange = (showComponent) => {
    setShowComponent(showComponent);
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
                      //elementList={handleElements}
                      contextList={handleContextEl}
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
                    <FontAwesomeIcon icon={faFont} />
                    Add Text
                  </MDBListGroupItem>
                ) : (
                  showComponent &&
                  activeT && (
                    <Text
                      onStateChange={handleTextStateChange}
                      componentChange={handleComponentChange}
                      elementList={displayElements}
                      listEl={displayElements}
                      contextList={handleContextEl}
                    ></Text>
                  )
                )}
                <hr></hr>
                {!showComponent && !activeB ? (
                  <MDBListGroupItem
                    onClick={handleClickButton}
                    name="liClick"
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <FontAwesomeIcon icon={faStop} />
                    Add button
                  </MDBListGroupItem>
                ) : (
                  showComponent &&
                  activeB && (
                    <Button
                      onStateChange={handleButtonStateChange}
                      componentChange={handleComponentChange}
                      //elementList={handleElements}
                      contextList={handleContextEl}
                    ></Button>
                  )
                )}
              </MDBListGroup>
            </div>
            <div className="col">
              <div class="smartphone">
                <IFrame>
                  <List children={elementContextList} />
                </IFrame>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="buttonHolder" className="col">
              {/* {clicked ? (
                <button
                  type="submit"
                  onClick={createNotes}
                  className="btn btn-success"
                >
                  Create message
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={addElement}
                  className="btn btn-dark"
                >
                  Save message
                </button>
              )} */}
              <button className="btn btn-dark" onClick={handleSubmit}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateNote;
