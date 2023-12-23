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
    let response = await axiosInstance.get(`/api/message_view/${params.id}/`);
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
    console.log(e.target.value);
    setMessageName(e.target.value);
    setIsDirty(true);
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
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center xl:mb-3">
            <input
              value={messageName}
              onChange={handleMessageName}
              className=" bg-gray-200 mb-4 text-black hover:bg-gray-400 duration-200 text-light font-light py-2 px-4 rounded-md placeholder:text-black placeholder:font-normal"
              placeholder={message?.message_name}
            />
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
          <div className="flex flex-row bg-darkestGray rounded-md">
            <div className="flex flex-col p-10 relative">
              <div className="flex flex-col">
                <div className="flex-none w-[200px] h-[500px] bg-darkestGray rounded-md p-3">
                  <div className="flex flex-row justify-between">
                    <div
                      onClick={() => handleClick("image")}
                      name="liClick"
                      className="mb-3 flex flex-row border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-16 w-20 mt-2 fill-gray-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                    <div
                      onClick={() => handleClick("text")}
                      name="liClick"
                      className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-16 w-20 mt-2 fill-gray-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div
                      onClick={() => handleClick("button")}
                      name="liClick"
                      className="mb-3 flex flex-row justify-between border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-16 w-20 mt-2 fill-gray-400"
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
                    <div
                      onClick={() => handleClick("survey")}
                      name="liClick"
                      className="mb-3 flex flex-row border-gray-600 border-1 rounded transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-16 w-20 mt-2 fill-gray-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 mt-20">
              {selectedComponent && componentsMap[selectedComponent]}
            </div>
            <div className="col p-10">
              <div class="h-[500px] w-[250px] relative mx-auto border-gray-600 dark:border-gray-800 bg-gray-600 border-[14px] rounded-[2.5rem] shadow-xl">
                <div class="w-[108px] h-[10px] xl:w-[148px] xl:h-[18px] bg-gray-600 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div class="h-[46px] w-[3px] bg-gray-600 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-600 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div class="h-[64px] w-[3px] bg-gray-600 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div class="w-[225px] h-[470px] rounded-[2rem] overflow-auto bg-white dark:bg-gray-800">
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
    </section>
  );
};

export default memo(EditMessage);
