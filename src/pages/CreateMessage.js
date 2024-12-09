import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreationMessage.css";

import Image from "../components/Image";
import Text from "../components/Text";
import Button from "../components/Button";
import Survey from "../components/Survey/Survey";
import AiGenerator from "../components/AiGenerator";
import { setOpenModal } from "../redux/reducers/modalReducer";
import { createElements } from "../utils/helpers/createElements";
import { setState } from "../redux/reducers/formReducer";
import { setList } from "../redux/reducers/elementReducer";
import { ElementContext } from "../context/ElementContext";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import SvgLoader from "../components/SvgLoader";
import PreviewPanel from "../components/PreviewComponent/PreviewPanel";
import { setMessages } from "../redux/reducers/messageReducer";

const CreateNote = () => {
  const Package_gold = process.env.GOLD_PLAN;
  const Package_basic = process.env.BASIC_PLAN;
  const { deleteElement } = useContext(ElementContext);
  const {
    currentUser,
    dispatch,
    currentModalState,
    currentPackageState,
    currentMessages,
  } = useRedux();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [messageName, setMessageName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [displayElItem, setDisplayItems] = useState([]);
  const [elementsList, setElementsList] = useState([]);
  const [elementContextList, setElementsContextList] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [messageObj, setMessageObj] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const axiosInstance = useAxiosInstance();
  const [imageStateVal, setImageStateVal] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [device, setDevice] = useState("phone");

  useEffect(() => {
    if (elementContextList.length > 0) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
    dispatch(setOpenModal({ open: false }));
  }, [elementContextList, elementsList, currentModalState, isLoading]);

  useEffect(() => {
    if (errorMsg) {
      // Only run the timer if there's an error message
      const timer = setTimeout(() => setErrorMsg(""), 3000);

      return () => clearTimeout(timer); // Clear the timer when the component unmounts or `errorMsg` changes
    }
  }, [errorMsg]);

  const handleClick = (componentKey) => {
    setSelectedComponent((prevSelectedComponent) =>
      prevSelectedComponent === componentKey ? null : componentKey
    );
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

  const handleSubmit = async () => {
    dispatch(setList({ populated: true }));
    setIsLoading(true);

    let messageObject;
    try {
      messageObject = await createMessage();
      const requestType = "create";
      const createElementsData = createElements({
        elementContextList,
        messageObject,
        axiosInstance,
        requestType,
      });
      const createdElements = await createElementsData(); // Await the result

      setElementsList((prevElement) => prevElement.concat(createdElements));

      return createdElements;
    } catch (error) {
      console.log("Error creating elements:", error);
      return;
    }
  };

  const createMessage = async () => {
    let messageObjId;
    try {
      const requestData = {
        users: currentUser,
        message_name: messageName,
      };

      let response = await axiosInstance.post(
        "/api/create_notes/",
        requestData
      );

      if (response.status === 200) {
        dispatch(setState({ isDirty: false }));
        messageObjId = response.data.note.id;
        setMessageObj(response.data.note);
        const newMessageList = [...currentMessages, response.data.note];
        dispatch(setMessages(newMessageList));
        setIsLoading(false);
        navigate("/home");
      } else {
        setErrorMsg("SS");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMsg(error.response.data.message_name);
      setIsLoading(false);
    }

    return messageObjId;
  };

  const handleContextEl = (elementContextList) => {
    setElementsContextList(elementContextList);
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

  const handleClicked = (element) => {
    deleteElement(element);

    setElementsContextList((prevItems) =>
      prevItems.filter((item) => item !== element)
    );
  };

  const updateElements = (element) => {
    setElementsContextList(element);
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
        elementList={displayElements}
        listEl={isCreate}
        contextList={handleContextEl}
        setComponentState={setComponent}
        imageState={setImageStateVal}
      />
    ),
    text: (
      <Text
        elementList={displayElements}
        listEl={isCreate}
        contextList={handleContextEl}
        setComponentState={setComponent}
      />
    ),
    button: (
      <Button
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
      />
    ),
    survey: (
      <Survey
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
      />
    ),
    aiContent: (
      <AiGenerator
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
      />
    ),
  };

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
            <div className="flex flex-row">
              <span className="lg:text-xl 2xl:text-2xl text-lg text-white font-semibold mx-20">
                Create Content
              </span>
            </div>
            <div class="inline-flex items-center mx-20">
              {!isLoading ? (
                <button
                  onClick={handleSubmit}
                  className="text-white bg-cyan-600 p-1 rounded-lg  hover:bg-cyan-400 smooth-hover flex flex-row transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105"
                >
                  <h2 className="text-lg mx-2">Create</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 mt-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              ) : (
                <SvgLoader width={7} height={7} />
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row rounded-2xl md:mx-10">
            <div className="flex flex-col p-10">
              <div className="flex flex-col md:w-80 gap-2 rounded-2xl p-4 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
                {errorMsg && (
                  <p className="text-red-600 font-light ml-2">{errorMsg}</p>
                )}
                {/* <span className="text-left text-white font-semibold">
                  Campaign name
                </span> */}
                <input
                  onChange={handleMessageName}
                  className="flex-1 bg-mainBlue text-white border-2 border-gray-800 rounded-lg p-2 focus:bg-slate-700"
                  placeholder="Enter the name for campaign.."
                />
                {showSaveButton && (
                  <button
                    onClick={handleSave}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg duration-200"
                  >
                    Save
                  </button>
                )}
              </div>
              <div className="flex lg:h-[68%] gap-2 md:flex-col p-4 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 mt-4 rounded-2xl">
                <span className="text-left text-white text-normal lg:text-lg font-semibold ml-4 md:ml-0">
                  Content elements
                </span>
                <p className="text-white/70 text-start text-sm">
                  Click on one of the buttons below to start adding elements to
                  your content.
                </p>
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
                      Add Image
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
                      Add CTA
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
                      Add Text
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
                      Add Survey
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  {currentPackageState?.package === Package_gold ||
                  Package_basic ? (
                    <div
                      onClick={
                        imageStateVal ? null : () => handleClick("aiContent")
                      }
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
                          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                        />
                      </svg>

                      <p className="text-white/70 font-base text-normal text-justify my-auto">
                        Use AI
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="w-[100%] h-[124px] mx-4">
              <div className="max-w-[90%] h-36 lg:mt-20">
                {selectedComponent && componentsMap[selectedComponent]}
              </div>
            </div>
            <div className="p-10 mt-20 md:mt-0">
              <PreviewPanel
                device={device}
                handleClicked={handleClicked}
                elementContextList={elementContextList}
                updateElements={updateElements}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateNote;
