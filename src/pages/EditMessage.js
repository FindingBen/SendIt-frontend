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
  const [device, setDevice] = useState("tablet");

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
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
            <div className="flex flex-row">
              <span className="text-3xl text-white font-semibold mx-20">
                Edit Content
              </span>
            </div>

            <div class="inline-flex items-center mx-20 relative">
              {!isLoading ? (
                <button
                  onClick={editMessage}
                  className="text-white bg-purpleHaze p-1 rounded-lg hover:text-white flex flex-row transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105"
                >
                  <h2 className="text-lg mx-2">Edit</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 my-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              ) : (
                <div role="status" className="absolute top-0 right-0">
                  <SvgLoader height={6} width={6} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row rounded-2xl mx-20">
            <div className="flex flex-col p-10">
              <div className="flex flex-col w-96 gap-2 rounded-2xl p-4 bg-navBlue border-2 border-gray-800">
                <span className="text-left text-white">Campaign name</span>
                <input
                  defaultValue={message?.message_name}
                  onChange={handleMessageName}
                  className="flex-1 bg-white rounded-lg p-2"
                />
                {showSaveButton && (
                  <button
                    onClick={handleSave}
                    className="bg-purpleHaze text-white px-4 py-2 rounded-lg duration-200 cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col p-4 bg-navBlue border-2 border-gray-800 mt-4 rounded-2xl">
                  <span className="text-left text-white">Content elements</span>
                  <div className="flex flex-row mt-2 gap-2">
                    <div
                      onClick={
                        imageStateVal ? null : () => handleClick("image")
                      }
                      name="liClick"
                      className="mb-3 flex flex-row rounded-md bg-white p-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.5"
                        stroke="currentColor"
                        class="h-5 w-5 text-black"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <p className="text-black font-normal text-base text-justify my-auto">
                        Add Image
                      </p>
                    </div>
                    <div
                      onClick={
                        imageStateVal ? null : () => handleClick("button")
                      }
                      name="liClick"
                      className="mb-3 flex flex-row rounded-md bg-white p-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.5"
                        stroke="currentColor"
                        class="h-5 w-5 text-black"
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
                      <p className="text-black font-normal text-base text-justify my-auto">
                        Add CTA
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div
                      onClick={imageStateVal ? null : () => handleClick("text")}
                      name="liClick"
                      className="mb-3 flex flex-row rounded-md bg-white p-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.5"
                        stroke="currentColor"
                        class="h-5 w-5 text-black"
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
                      <p className="text-black font-normal text-base text-justify my-auto">
                        Add Text
                      </p>
                    </div>
                    <div
                      onClick={
                        imageStateVal ? null : () => handleClick("survey")
                      }
                      name="liClick"
                      className="mb-3 flex flex-row rounded transition bg-white p-2 ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.5"
                        stroke="currentColor"
                        class="h-5 w-5 text-black"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                        />
                      </svg>
                      <p className="text-black font-normal text-normal text-justify my-auto">
                        Add Survey
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[100%]">
              <div className="max-w-[90%] h-36 mt-20">
                {selectedComponent && componentsMap[selectedComponent]}
              </div>
            </div>
            <div className="col p-10">
              <div className="flex flex-row bg-navBlue border-2 border-gray-800 p-2 rounded-2xl mb-2 mx-auto gap-2 w-32">
                <span className="text-white">Preview</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={() => setDevice("phone")}
                  stroke-width="1.0"
                  stroke="currentColor"
                  class="w-6 h-6 text-white hover:bg-white/50 cursor-pointer rounded-lg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={() => setDevice("tablet")}
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-white hover:bg-white/50 cursor-pointer rounded-lg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              <PreviewPanel
                device={device}
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
