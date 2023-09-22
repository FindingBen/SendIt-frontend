import React, { useState, useContext, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setState } from "../features/modal/formReducer";
import "../css/CreationMessage.css";
// import "../css/RootIframe.css";

import Image from "../components/Image";
import Text from "../components/Text";
import List from "../components/List";
import Button from "../components/Button";
import { setList } from "../features/elements/elementReducer";
import { useEffect } from "react";
import modalReducer, {
  selectModalCall,
  setOpenModal,
} from "../features/modal/modalReducer";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { setModalState } from "../features/modal/modalReducer";
import {
  selectEditPageState,
  setEditPage,
} from "../features/elements/editPageReducer";
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
  const [elements, setElements] = useState([]);
  const { createElement, deleteElement } = useContext(ElementContext);
  const [elementContextList, setElementsContextList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [isDirty, setIsDirty] = useState(false);
  const [toDelete, setToDelete] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isPopulated, setIsPopulated] = useState(false);
  const axiosInstance = useAxiosInstance();
  const modal_state = useSelector(selectModalCall);
  const isFormDirt = useSelector(selectEditPageState);
  const dispatch = useDispatch();
  const params = useParams();
  const container = document?.getElementById("myList");
  const [getId, setId] = useState();

  useEffect(() => {
    setIsLoaded(true);
    if (isFormDirt) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
    dispatch(setOpenModal({ open: false }));
    dispatch(setModalState({ show: false }));
  }, [modal_state, isFormDirt]);

  useEffect(() => {
    messageView();
  }, []);

  const handleClickImage = (e) => {
    e.preventDefault();
    setActive(!active);
    setShowComponent(!showComponent);
    addEmptyListItem();
  };
  console.log(isPopulated);
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
    if (container) {
      const newItem = document?.createElement("li");

      newItem.id = "temp";
      container?.appendChild(newItem);
    }
  };

  let messageView = async () => {
    setId(params.id);
    let response = await axiosInstance.get(`/api/message_view/${params.id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token),
      },
    });
    if (response.status === 200 || 201) {
      setElements(response.data.element_list);
      setIsLoaded(false);
    }
  };

  const deleteElements = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        toDelete?.map(async (elementObj) => {
          try {
            const response = await axiosInstance.delete(
              `/api/delete_element/${elementObj.id}/`
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
        `/api/message_view_edit/${params.id}/`,
        requestData,
        {
          headers: {
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (response.status === 200) {
        dispatch(setState({ isDirty: false }));
        dispatch(setEditPage({ isEditFormDirty: false }));
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
    dispatch(setEditPage({ isEditFormDirty: true }));
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
    deleteElement(element);

    setToDelete((prevItems) => [...prevItems, element]);
    setElementsContextList((prevItems) =>
      prevItems.filter((item) => item !== element)
    );
    setElements((prevItems) => prevItems.filter((item) => item !== element));
  };

  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <div className="flex justify-between items-center mb-3">
              <h3 class="text-3xl font-extralight text-left text-white/50">
                Edit content
              </h3>
              <div class="inline-flex items-center space-x-2">
                <button onClick={editMessage}>
                  <a
                    class="text-white/50 p-2 rounded-md hover:text-white smooth-hover flex flex-row"
                    href="#"
                  >
                    <h2 className="text-2xl mx-2">Edit</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 my-1"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-darkestGray rounded-md">
              <div className="col border-r-2 flex flex-col p-10">
                <h3 class="text-3xl text-center font-extralight text-white/50">
                  Content
                </h3>
                <div className="rounded-lg p-10">
                  <div className="flex flex-col" style={{ minWidthL: "22rem" }}>
                    {!showComponent && !active ? (
                      <div
                        style={{ width: "100%" }}
                        onClick={handleClickImage}
                        name="liClick"
                        className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded hover:bg-gray-500 cursor-pointer"
                      >
                        <svg
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
                        <h2 className="text-2xl text-right py-4 px-4 font-extralight text-white/50">
                          Add Image
                        </h2>
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
                          listEl={isCreate}
                          elementList={handleElementState}
                          contextList={handleContextEl}
                        ></Image>
                      )
                    )}

                    {!showComponent && !activeT ? (
                      <div
                        style={{ width: "100%" }}
                        onClick={handleClickText}
                        name="liClick"
                        className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded hover:bg-gray-500 cursor-pointer"
                      >
                        <svg
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
                        <h2 className="text-2xl text-right py-4 px-4 font-extralight text-white/50">
                          Add text
                        </h2>
                      </div>
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

                    {!showComponent && !activeB ? (
                      <div
                        style={{ width: "100%" }}
                        onClick={handleClickButton}
                        name="liClick"
                        className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded hover:bg-gray-500 cursor-pointer"
                      >
                        <svg
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
                        <h2 className="text-2xl text-right py-4 px-4 font-extralight text-white/50">
                          Add button
                        </h2>
                      </div>
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
                  </div>
                </div>
              </div>
              <div className="col p-10">
                <div class="relative mx-auto border-gray-600 dark:border-gray-800 bg-gray-600 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                  <div class="w-[148px] h-[18px] bg-gray-600 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div class="h-[46px] w-[3px] bg-gray-600 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div class="h-[46px] w-[3px] bg-gray-600 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div class="h-[64px] w-[3px] bg-gray-600 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div class="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                    <div class="mr-5 mt-2 flex justify-end space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-800"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-800"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>{" "}
                    <List
                      id="myList"
                      className="my-scroll-list"
                      children={elements}
                      clicked={handleClicked}
                    ></List>
                  </div>
                </div>
                {/* <button
                  style={{ marginLeft: "6%" }}
                  className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-5"
                  onClick={{ editMessage }}
                >
                  Save
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(EditMessage);
