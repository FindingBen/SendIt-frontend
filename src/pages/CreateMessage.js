import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import "../css/List.css";
import { AiFillPicture } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faFont } from "@fortawesome/free-solid-svg-icons";
import Image from "../components/Image";
import Text from "../components/Text";
import Button from "../components/Button";
//import IFrame from "../components/IFrame";
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
import useAxiosInstance from "../utils/axiosInstance";
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
  const [isCreate, setIsCreate] = useState(true);
  const [align, setAlign] = useState();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const axiosInstance = useAxiosInstance();
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
      const createdElements = await addElement(e);
      const requestData = {
        element_list: createdElements, // Map the created elements to their IDs
        users: user,
      };

      let response = await axiosInstance.post(
        "/api/create_notes/",
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
          "/api/create_element/",
          formData,
          {
            headers: {
              Authorization: "Bearer " + String(token),
            },
          }
        );

        //let data = await response.json();
        console.log(response.data);
        if (response.status === 200) {
          createdElements.push(response.data);
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

  const setAlignemnt = (align) => {
    setAlign(align);
  };

  const handleClicked = (element) => {
    deleteElement(element);

    setElementsContextList((prevItems) =>
      prevItems.filter((item) => item !== element)
    );
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 mb-5">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Create your ad content
              </h1>
              <hr></hr>
            </div>
            <div className="col">
              <div
                className="static bg-indigo-400 rounded-lg p-10 shadow-2xl"
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
                        elementList={displayElements}
                        listEl={isCreate}
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
                        elementList={displayElements}
                        listEl={isCreate}
                        contextList={handleContextEl}
                        getAlignment={setAlignemnt}
                      ></Text>
                    )
                  )}
                  <hr></hr>
                  {!showComponent && !activeB ? (
                    <MDBListGroupItem
                      onClick={handleClickButton}
                      name="liClick"
                      className="list-group-item d-flex justify-content-between align-items-center "
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
                        listEl={isCreate}
                        contextList={handleContextEl}
                        elementList={displayElements}
                      ></Button>
                    )
                  )}
                </MDBListGroup>
              </div>
            </div>

            <div className="col">
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div
                  className="rounded-[2rem] overflow-hidden w-[270px] h-[572px] bg-white dark:bg-gray-800"
                  id="screen"
                >
                  <List
                    id="myList"
                    className="my-scroll-list"
                    children={elementContextList}
                    clicked={handleClicked}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="buttonHolder" className="col">
              <button
                className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={handleSubmit}
              >
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
