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
import { useRef } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxiosInstance();
  const modal_state = useSelector(selectModalCall);
  const isFormDirt = useSelector(selectEditPageState);
  const dispatch = useDispatch();
  const params = useParams();
  const container = document?.getElementById("myList");
  const [getId, setId] = useState();
  const [createdEl, setCreatedEl] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    if (isFormDirt) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
    dispatch(setOpenModal({ open: false }));
    dispatch(setModalState({ show: false }));
  }, [modal_state, isFormDirt, isLoading]);

  useEffect(() => {}, [elements]);

  useEffect(() => {
    updateElementsOrder();
    console.log(elements);
  }, [createdEl]);
  console.log(createdEl);
  useEffect(() => {
    messageView();
  }, []);

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
      setElements(response.data);
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

  const filterEl = async () => {
    const condition = true; // Replace with the value you want to filter by

    // Use the filter method to create a new array with filtered elements
    const filteredElements = elements.filter(
      (element) => element.context !== condition
    );
    //console.log("SSSSS", filteredElements);
    setElements(filteredElements);
    return filteredElements;
  };

  const updateElementsOrder = async () => {
    //const filtered = await filterEl();
    //console.log("inside update elements", updatedEl);
    console.log("about to be updated", elements);
    const elementsToUpdate = elements.filter((element) => !element.context);
    for (const element of elementsToUpdate) {
      try {
        // Update the order property of the element
        element.order = elements.findIndex((el) => el.id === element.id);

        // Now you can make an API request to update the element with the new order value
        const elementId = element.id;
        const requestedData = { order: element.order };

        // Make your API request here
        await axiosInstance.put(
          `/api/update_element/${elementId}/`,
          requestedData
        );

        //console.log(`Element ${elementId} updated with order ${element.order}`);
      } catch (error) {
        // Handle the error if the update fails
        console.error(`Failed to update element ${element.id}: ${error}`);
      }
    }
    console.log("updatedElements", elements);
    return elements;
  };

  const editMessage = async (e) => {
    setIsLoading(true);
    try {
      const createdElements = await addElement(e);
      console.log(createdElements);
      //await updateElementsOrder(e);
      if (createdElements.length > 0) {
        await updateElementsOrder();
      }

      console.log("ELEMENTS", createdElements);
      const requestData = {
        //element_list: elements, // Map the created elements to their IDs
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
        setIsLoading(false);
        navigate("/home");
      } else {
        console.log("Failed to create notes:", response.data);
      }
    } catch (error) {
      console.log("Error creating elements and notes:", error);
    }
  };

  const addElement = async () => {
    dispatch(setList({ populated: true }));
    const createdElements = [];

    try {
      for (let i = 0; i < elements.length; i++) {
        const elementContext = elements[i];

        const formData = new FormData();
        if ("context" in elementContext) {
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
          formData.append("message", getId);
          formData.append("order", elementContext.order);

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
            createdElements.push(response.data.element);
            //setCreatedEl(createdElements);
            console.log(response);
          } else {
            console.log("Failed to create element:", elementContext);
          }
        }
        setElements((prevElement) => [...prevElement, ...createdElements]);
      }
    } catch (error) {
      console.log("Error creating elements:", error);
    }

    return elements;
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

  const updateElements = (element) => {
    console.log("Updating...", element);
    setElements(element);
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
                {!isLoading ? (
                  <button onClick={editMessage}>
                    <a
                      class="text-white/50 p-2 rounded-md hover:text-white smooth-hover flex flex-row"
                      href="#"
                    >
                      <h2 className="text-2xl mx-2">Save</h2>
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
                ) : (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Saving...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 bg-darkestGray rounded-md">
              <div className="col border-r-2 flex flex-col p-10">
                <h3 class="text-3xl text-center font-extralight text-white/50">
                  Click and create Content
                </h3>
                <div className="rounded-lg p-10">
                  <div className="flex flex-col" style={{ minWidthL: "22rem" }}>
                    {!showComponent && !active ? (
                      <div
                        style={{ width: "100%" }}
                        onClick={handleClickImage}
                        name="liClick"
                        className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
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
                        className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
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
                        className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
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
                <div class="h-[500px] w-[250px] relative mx-auto border-gray-600 dark:border-gray-800 bg-gray-600 border-[14px] rounded-[2.5rem] xl:h-[600px] xl:w-[300px] shadow-xl">
                  <div class="w-[108px] h-[10px] xl:w-[148px] xl:h-[18px] bg-gray-600 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div class="h-[46px] w-[3px] bg-gray-600 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div class="h-[46px] w-[3px] bg-gray-600 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div class="h-[64px] w-[3px] bg-gray-600 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div class="w-[225px] h-[470px] rounded-[2rem] overflow-hidden xl:w-[272px] xl:h-[572px] bg-white dark:bg-gray-800">
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
                      updatedList={updateElements}
                    ></List>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(EditMessage);
