import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setState } from "../features/modal/formReducer";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { AiFillPicture } from "react-icons/ai";
import Image from "../components/Image";
import Text from "../components/Text";
import List from "../components/List";
import Button from "../components/Button";
import { setList } from "../features/elements/elementReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faFont } from "@fortawesome/free-solid-svg-icons";
import IFrame from "../components/IFrame";
import { useEffect } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { setModalState } from "../features/modal/modalReducer";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../utils/axiosInstance";
import { ElementContext } from "../context/ElementContext";

const EditMessage = () => {
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const [active, setActive] = useState(false);
  const [activeT, setActiveT] = useState(false);
  const [activeB, setActiveB] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [displayElItem, setDisplayItems] = useState([]);
  const [elements, setElements] = useState([]);
  const { createElement, deleteElement } = useContext(ElementContext);
  const [elementContextList, setElementsContextList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [isDirty, setIsDirty] = useState(false);
  const [toDelete, setToDelete] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const axiosInstance = useAxiosInstance();
  const dispatch = useDispatch();
  let BASE_URL = "http://127.0.0.1:8000";
  const params = useParams();
  const iframeEl = document.getElementById("myFrame");
  const [getId, setId] = useState();
  useEffect(() => {
    messageView();

    dispatch(setModalState({ show: false }));
  }, [isLoaded]);

  const handleClickImage = (e) => {
    e.preventDefault();
    setActive(!active);
    setShowComponent(!showComponent);
    addEmptyListItem();
  };

  const handleClickText = (e) => {
    e.preventDefault();
    setActiveT(!activeT);
    setShowComponent(!showComponent);
    addEmptyListItem();
  };

  const handleClickButton = (e) => {
    e.preventDefault();
    setActiveB(!activeB);
    setShowComponent(!showComponent);
    addEmptyListItem();
  };

  const addEmptyListItem = () => {
    if (iframeEl) {
      const iframeDocument = iframeEl.contentDocument;
      if (iframeDocument) {
        const listContainer = iframeDocument.getElementById("myList");
        if (listContainer) {
          const newItem = document.createElement("li");
          newItem.className = "list-group-item";
          newItem.id = "temp";
          listContainer.appendChild(newItem);
        }
      }
    }
  };

  let messageView = async () => {
    setId(params.id);
    let response = await axiosInstance.get(
      `http://127.0.0.1:8000/api/message_view/${params.id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    //let data = await response.json();
    setElements(response.data.element_list);
    setIsLoaded(false);
  };

  const deleteElements = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        toDelete?.map(async (elementObj) => {
          try {
            const response = await axiosInstance.delete(
              `http://localhost:8000/api/delete_element/${elementObj.id}/`
            );
            if (response.status === 200) {
              console.log("Success");
            }
          } catch (error) {
            console.log("Error deleting element:", error);
          }
        })
      );
    } catch (error) {
      console.log("Error deleting elements:", error);
    }
  };

  const editMessage = async (e) => {
    e.preventDefault();
    if (toDelete.length > 0) {
      await deleteElements(e);
    }
    try {
      const createdElements = await addElement(e); // Store the created elements in a variable
      console.log(createdElements);
      const requestData = {
        element_list: createdElements, // Map the created elements to their IDs
        users: user,
      };

      let response = await axiosInstance.put(
        `http://127.0.0.1:8000/api/message_view_edit/${params.id}/`,
        requestData,
        {
          headers: {
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (response.status === 200) {
        dispatch(setState({ isDirty: false }));
        navigate("/home");
      } else {
        console.log("Failed to create notes:", response.data);
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

        if (elementContext.element_type === "Img") {
          formData.append("image", elementContext.file);
        } else if (elementContext.element_type === "Text") {
          formData.append("text", elementContext.text);
          formData.append("alignment", elementContext.alignment);
        } else if (elementContext.element_type === "Button") {
          formData.append("button_title", elementContext.button_title);
          formData.append("button_link", elementContext.button_link);
        }
        formData.append("element_type", elementContext.element_type);
        formData.append("users", elementContext.users);

        let response = await axiosInstance.post(
          "http://127.0.0.1:8000/api/create_element/",
          formData,
          {
            headers: {
              Authorization: "Bearer " + String(token),
            },
          }
        );

        if (response.status === 200) {
          createdElements.push(response.data);
          console.log(response);
        } else {
          console.log("Failed to create element:", elementContext);
          return; // Return undefined to indicate a failure
        }
      }

      setElements((prevElement) => [...prevElement, ...createdElements]);
      return createdElements; // Return the created elements from the function
    } catch (error) {
      console.log("Error creating elements:", error);
      return; // Return undefined to indicate a failure
    }
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

  const handleContextEl = (elementContextList) => {
    setElementsContextList(elementContextList);
    setIsDirty(true);
  };

  const handleButtonStateChange = (activeB) => {
    setActiveB(activeB);
  };

  const handleComponentChange = (showComponent) => {
    setShowComponent(showComponent);
  };

  const handleElementState = (elements) => {
    setElements(elements);
  };

  const handleClicked = (element) => {
    console.log(element);
    deleteElement(element);
    console.log("TEST");
    //setElements((prevItems) => prevItems.filter((item) => item.id !== element));
    setToDelete((prevItems) => [...prevItems, element]);
    setElementsContextList((prevItems) =>
      prevItems.filter((item) => item !== element)
    );
    setElements((prevItems) => prevItems.filter((item) => item !== element));
  };

  console.log(elements);
  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="row">
            <div className="col-12 mb-5">
              <h1 className="text-3xl font-bold mb-4">View and edit</h1>
              <hr></hr>
            </div>
            <div className="col">
              <div
                className="static bg-indigo-400 rounded-lg p-10"
                style={{ width: "97%" }}
              >
                <MDBListGroup style={{ minWidthL: "22rem" }}>
                  {!showComponent && !active ? (
                    <MDBListGroupItem
                      onClick={handleClickImage}
                      name="liClick"
                      className="list-group-item d-flex justify-content-between align-items-center mb-3"
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
                        listEl={isCreate}
                        elementList={handleElementState}
                        contextList={handleContextEl}
                      ></Image>
                    )
                  )}
                  <hr></hr>
                  {!showComponent && !activeT ? (
                    <MDBListGroupItem
                      onClick={handleClickText}
                      name="liClick"
                      className="list-group-item d-flex justify-content-between align-items-center mb-3"
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
                        listEl={isCreate}
                        elementList={handleElementState}
                        contextList={handleContextEl}
                      ></Text>
                    )
                  )}
                  <hr></hr>
                  {!showComponent && !activeB ? (
                    <MDBListGroupItem
                      onClick={handleClickButton}
                      name="liClick"
                      className="list-group-item d-flex justify-content-between align-items-center mb-3"
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
                        elementList={handleElementState}
                        contextList={handleContextEl}
                        listEl={isCreate}
                      ></Button>
                    )
                  )}
                </MDBListGroup>
              </div>
            </div>
            <div className="col">
              <div class="smartphone">
                <IFrame idPass={getId}>
                  {isLoaded ? (
                    /* Render the loading circle or spinner */
                    <div className="spinner-grow" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <List children={elements} clicked={handleClicked}></List>
                  )}
                </IFrame>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="buttonHolder" className="col">
              <button
                type="submit"
                onClick={editMessage}
                className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
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
