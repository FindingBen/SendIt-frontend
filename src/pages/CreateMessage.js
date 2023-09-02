import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
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
    <section className="vh-100">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row" id="secondDiv">
            <div
            id="headingDiv"
              className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40", width:'95%' }}
            >
              <div className="row">
                <div className="col">
                  <h1 className="text-3xl mb-2 mt-3 text-gray-300 text-left text-custom">
                    Content creation
                  </h1>
                </div>
                <div className="col">
                  <h1 className="text-2xl mb-2 mt-3 text-gray-200 text-right text-custom">
                    Sms credit count: 0
                  </h1>
                </div>
              </div>
            </div>
            <div className="col mt-3" style={{ paddingLeft: "0%" }}>
              <div
                className="static rounded-lg p-10 border-1 border-gray-600"
                style={{
                  width: "90%",
                  backgroundColor: "#3d3e40",
                }}
              >
                <div className="row" style={{ minWidthL: "22rem" }}>
                  {!showComponent && !active ? (
                    <div
                      style={{ width: "20%" }}
                      onClick={handleClickImage}
                      name="liClick"
                      className="mb-3 ml-3 border-gray-600 border-1 rounded hover:bg-gray-500 cursor-pointer"
                    >
                      <svg
                        style={{ marginLeft: "12%" }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-20 h-15 fill-gray-400 custom-svg-w"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
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

                  {!showComponent && !activeT ? (
                    <div
                      style={{ width: "20%" }}
                      onClick={handleClickText}
                      name="liClick"
                      className="mb-3 ml-3 border-gray-600 border-1 rounded hover:bg-gray-500 cursor-pointer"
                    >
                      <svg
                        style={{ marginLeft: "12%" }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-20 h-15 fill-gray-400 custom-svg-w"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>
                    </div>
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

                  {!showComponent && !activeB ? (
                    <div
                      style={{ width: "20%" }}
                      onClick={handleClickButton}
                      name="liClick"
                      className="mb-3 ml-3 border-gray-600 border-1 rounded hover:bg-gray-500 cursor-pointer"
                    >
                      <svg
                        style={{ marginLeft: "12%" }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-20 h-15 fill-gray-400 custom-svg-w"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
                        />
                      </svg>
                    </div>
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
                </div>
              </div>
            </div>

            <div className="col">
              <div className="custom-size relative mx-auto border-gray-800 mt-3 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[128px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div
                  className="rounded-[2rem] overflow-hidden w-[270px] h-[572px] bg-gray-300 dark:bg-gray-800"
                  id="screen"
                >
                  <List
                    id="myList"
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
