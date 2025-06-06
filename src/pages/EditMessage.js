import React, { useState, useContext, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setState } from "../redux/reducers/formReducer";
import "../css/CreationMessage.css";
import Image from "../components/Image";
import Text from "../components/Text";
import List from "../components/List";
import Button from "../components/Button";
import Survey from "../components/Survey/Survey";
import { setList } from "../redux/reducers/elementReducer";
import { useEffect } from "react";
import { setOpenModal } from "../redux/reducers/modalReducer";
import { setModalState } from "../redux/reducers/modalReducer";
import { setEditPage } from "../redux/reducers/editPageReducer";
import useAxiosInstance from "../utils/axiosInstance";
import { ElementContext } from "../context/ElementContext";
import Loader from "../components/LoaderSkeleton/Loader";
import { useRedux } from "../constants/reduxImports";
import SvgLoader from "../components/SvgLoader";
import PreviewPanel from "../components/PreviewComponent/PreviewPanel";

const EditMessage = () => {
  const { currentPageState, dispatch, currentModalCall, currentUser } =
    useRedux();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [elements, setElements] = useState([]);
  const [message, setMessage] = useState("");
  const { deleteElement } = useContext(ElementContext);
  const [elementContextList, setElementsContextList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toDelete, setToDelete] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxiosInstance();
  const [messageName, setMessageName] = useState(message?.message_name);
  const params = useParams();
  const container = document?.getElementById("myList");
  const [getId, setId] = useState();
  const [createdEl, setCreatedEl] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [imageStateVal, setImageStateVal] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (currentPageState) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
    dispatch(setOpenModal({ open: false }));
    dispatch(setModalState({ show: false }));
  }, [currentModalCall, currentPageState, isLoading]);

  useEffect(() => {}, [elements]);
  // useEffect(() => {
  //   if (errorMsg) {
  //     // Only run the timer if there's an error message
  //     const timer = setTimeout(() => setErrorMsg(""), 3000);

  //     return () => clearTimeout(timer); // Clear the timer when the component unmounts or `errorMsg` changes
  //   }
  // }, [errorMsg]);
  useEffect(() => {
    updateElementsOrder();
  }, [createdEl]);

  useEffect(() => {
    messageView();
  }, []);

  const handleClick = (componentKey) => {
    removeEmptyListItem();
    addEmptyListItem();
    setSelectedComponent((prevSelectedComponent) =>
      prevSelectedComponent === componentKey ? null : componentKey
    );
  };

  const addEmptyListItem = () => {
    if (container) {
      const newItem = document?.createElement("li");

      newItem.id = "temp";
      container?.appendChild(newItem);
    }
  };

  const removeEmptyListItem = () => {
    const tempItem = container?.querySelector("#temp");
    if (tempItem) {
      container?.removeChild(tempItem);
    }
  };

  let messageView = async () => {
    setId(params.id);
    let response = await axiosInstance.get(`/api/view/${params.id}/`);
    if (response.status === 200 || 201) {
      setElements(response.data.elements);
      setIsLoaded(false);
      setMessage(response.data.message);
    }
  };

  const updateElementsOrder = async () => {
    const elementsToUpdate = elements.filter((element) => !element.context);
    for (const element of elementsToUpdate) {
      try {
        // Update the order property of the element
        element.order = elements.findIndex((el) => el.id === element.id);

        // Now you can make an API request to update the element with the new order value
        const elementId = element.id;
        const requestedData = { order: element.order };

        await axiosInstance.put(
          `/api/update_element/${elementId}/`,
          requestedData
        );
      } catch (error) {
        // Handle the error if the update fails
        console.error(`Failed to update element ${element.id}: ${error}`);
      }
    }

    return elements;
  };

  const editMessage = async (e) => {
    setIsLoading(true);
    try {
      const createdElements = await addElement(e);

      if (createdElements.length > 0) {
        await updateElementsOrder();
      }

      const requestData = {
        users: currentUser,
        message_name: messageName,
      };

      let response = await axiosInstance.put(
        `/api/message_view_edit/${params.id}/`,
        requestData
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
            formData.append(
              "unique_button_id",
              elementContext.unique_button_id
            );
            formData.append("button_title", elementContext.button_title);
            formData.append("button_link", elementContext.button_link);
            formData.append("button_color", elementContext.button_color);
          } else if (elementContext.element_type === "Survey") {
            formData.append("survey", elementContext.survey);
            formData.append("question_type", elementContext.question_type);
          }
          formData.append("element_type", elementContext.element_type);
          formData.append("users", elementContext.users);
          formData.append("message", getId);
          formData.append("order", elementContext.order);

          let response = await axiosInstance.post(
            "/api/create_element/",
            formData
          );

          if (response.status === 200) {
            createdElements.push(response.data.element);
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

  const handleElementState = (elements) => {
    setElements(elements);
  };

  const handleMessageName = (e) => {
    setMessageName(e.target.value);
    setIsDirty(true);
    setShowSaveButton(e.target.value.length > 0);
  };

  const handleSave = (e) => {
    setMessageName(messageName);
    setShowSaveButton(false);
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
    setElements(element);
  };

  const setComponent = () => {
    setSelectedComponent(null);
  };

  const componentsMap = {
    image: (
      <Image
        handleFiles={handleFiles}
        handleImages={handleImages}
        listImages={images}
        listEl={isCreate}
        elementList={handleElementState}
        contextList={handleContextEl}
        imageState={setImageStateVal}
        setComponentState={setComponent}
      />
    ),
    text: (
      <Text
        elementList={handleElementState}
        listEl={isCreate}
        contextList={handleContextEl}
        setComponentState={setComponent}
      />
    ),
    button: (
      <Button
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={handleElementState}
        setComponentState={setComponent}
      />
    ),
    survey: (
      <Survey
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={handleElementState}
        setComponentState={setComponent}
      />
    ),
  };

  return (
    <section className="max-h-screen overflow-hidden w-full items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between border-b-2 border-gray-800 items-center h-20 bg-navBlue">
            <div className="flex flex-row">
              <span className="xl:text-2xl lg:text-xl text-normal text-white font-normal mx-20">
                Edit Content
              </span>
            </div>
            <div class="inline-flex items-center mx-20 relative">
              {!isLoading ? (
                <button
                  onClick={editMessage}
                  className="text-white bg-cyan-700 hover:bg-cyan-500 w-full p-1 rounded-lg hover:text-white flex flex-row"
                >
                  <h2 className="text-lg mx-2">Save changes</h2>
                </button>
              ) : (
                <div role="status" className="flex-1">
                  <Loader loading_name={"Saving changes..."} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row rounded-2xl h-screen">
            <div className="flex p-10 max-h-screen gap-2 md:flex-col bg-gradient-to-b from-lighterMainBlue to-mainBlue border-r-2 border-gray-800">
              <div className="flex flex-col lg:w-72 gap-2 rounded-2xl text-start mb-5">
                <span className="text-gray-200 text-normal lg:text-lg font-normal">
                  Campaign name
                </span>
                <input
                  defaultValue={message?.message_name}
                  onChange={handleMessageName}
                  className="flex-1 bg-mainBlue text-white border-2 border-gray-800 rounded-lg p-2 transition ease-in-out delay-90"
                />
                {showSaveButton && (
                  <button
                    onClick={handleSave}
                    className="bg-purpleHaze text-white px-4 py-2 w-full rounded-lg duration-200 cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>

              <span className="text-left text-white text-normal lg:text-lg font-semibold">
                Content elements
              </span>

              <div className="flex flex-row mt-2 gap-2">
                <div
                  onClick={imageStateVal ? null : () => handleClick("image")}
                  name="liClick"
                  className="component-button-create-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5 lg:h-8 lg:w-8 text-white/70"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>

                  <p className="text-white/70 font-normal text-base text-justify my-auto">
                    Image
                  </p>
                </div>
                <div
                  onClick={imageStateVal ? null : () => handleClick("button")}
                  name="liClick"
                  className="component-button-create-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5 lg:h-8 lg:w-8 text-white/70"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>

                  <p className="text-white/70 font-normal text-base text-justify my-auto">
                    CTA
                  </p>
                </div>
              </div>
              <div className="flex flex-row mt-2 lg:mt-0 gap-2">
                <div
                  onClick={imageStateVal ? null : () => handleClick("text")}
                  name="liClick"
                  className="component-button-create-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5 lg:h-8 lg:w-8 text-white/70"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>

                  <p className="text-white/70 font-normal text-base text-justify my-auto">
                    Text
                  </p>
                </div>
                <div
                  onClick={imageStateVal ? null : () => handleClick("survey")}
                  name="liClick"
                  className="component-button-create-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5 lg:h-8 lg:w-8 text-white/70"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>

                  <p className="text-white/70 font-normal text-normal text-justify my-auto">
                    Survey
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[100%] h-[124px] mx-10">
              <div className="max-w-[90%] h-36 lg:mt-20">
                {selectedComponent && componentsMap[selectedComponent]}
              </div>
            </div>
            <div className="p-10 mt-20 md:mt-0">
              <PreviewPanel
                handleClicked={handleClicked}
                elementContextList={elements}
                updateElements={updateElements}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(EditMessage);
