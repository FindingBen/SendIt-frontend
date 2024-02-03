import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreationMessage.css";
import "../css/RootIframe.css";
import Image from "../components/Image";
import Text from "../components/Text";
import Button from "../components/Button";
import Survey from "../components/Survey/Survey";
import AiGenerator from "../components/AiGenerator";
import { selectModalCall, setOpenModal } from "../redux/reducers/modalReducer";
import { createElements } from "../utils/helpers/createElements";
import List from "../components/List";
import { setState } from "../redux/reducers/formReducer";
import { setList } from "../redux/reducers/elementReducer";
import { ElementContext } from "../context/ElementContext";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import SvgLoader from "../components/SvgLoader";

const CreateNote = () => {
  const { deleteElement } = useContext(ElementContext);
  const { currentUser, dispatch, currentModalState, currentPackageState } =
    useRedux();
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
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    if (elementContextList.length > 0) {
      dispatch(setState({ isDirty: true }));
    } else {
      dispatch(setState({ isDirty: false }));
    }
    dispatch(setOpenModal({ open: false }));
  }, [elementContextList, elementsList, currentModalState, isLoading]);

  const handleClick = (componentKey) => {
    setSelectedComponent((prevSelectedComponent) =>
      prevSelectedComponent === componentKey ? null : componentKey
    );
  };
  console.log(currentPackageState);
  const handleMessageName = (e) => {
    setMessageName(e.target.value);
    setIsDirty(true);
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
        setIsLoading(false);
        navigate("/home");
      } else {
        console.log("Failed to create notes:", response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error creating elements and notes:", error);
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
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-row">
              <span className="text-2xl text-white">Create Content</span>
            </div>
            <div class="inline-flex items-center space-x-2">
              {!isLoading ? (
                <button
                  onClick={handleSubmit}
                  className="text-white bg-darkBlue p-2 rounded-md hover:text-white smooth-hover flex flex-row"
                >
                  <h2 className="lg:text-2xl text-xl mx-2">Create</h2>
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
                </button>
              ) : (
                <SvgLoader width={8} height={8} />
              )}
            </div>
          </div>
          <div className="flex flex-row bg-darkBlue rounded-md">
            <div className="flex flex-col p-10">
              <div className="flex flex-col w-96 gap-2 rounded-lg p-4 bg-darkGray">
                {errorMsg && (
                  <p className="text-red-600 font-light ml-2 mt-2">
                    {errorMsg}
                  </p>
                )}
                <span className="text-left text-white">Campaign name</span>
                <input
                  onChange={handleMessageName}
                  className="flex-1 bg-white rounded-lg p-2"
                />
              </div>
              <div className="flex flex-col p-4 bg-darkGray mt-4 rounded-lg">
                <span className="text-left text-white">Content elements</span>
                <div className="flex flex-row mt-2 gap-2">
                  <div
                    onClick={() => handleClick("image")}
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
                    onClick={() => handleClick("button")}
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
                    onClick={() => handleClick("text")}
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
                    onClick={() => handleClick("survey")}
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
                <div className="flex flex-row justify-between">
                  {currentPackageState === "Gold package" ? (
                    <div
                      onClick={() => handleClick("aiContent")}
                      name="liClick"
                      className="mb-2 flex flex-row rounded-md p-2 bg-white transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 duration-300 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="0.5"
                        stroke="currentColor"
                        data-slot="icon"
                        class="h-5 w-5 mt-2 text-black"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                        />
                      </svg>
                      <p className="text-black font-base text-normal text-justify my-auto">
                        Use AI
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 mt-20">
              {selectedComponent && componentsMap[selectedComponent]}
            </div>
            <div className="col p-10">
              <div class="h-[500px] w-[250px] relative mx-auto border-darkBlue bg-darkBlue border-[14px] rounded-[2.5rem] shadow-xl">
                <div class="w-[108px] h-[10px] xl:w-[148px] xl:h-[18px] bg-darkBlue top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div class="h-[46px] w-[3px] bg-darkBlue absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div class="h-[46px] w-[3px] bg-darkBlue absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div class="h-[64px] w-[3px] bg-darkBlue absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div class="w-[225px] h-[470px] rounded-[2rem] overflow-auto bg-white">
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
                    children={elementContextList}
                    clicked={handleClicked}
                    updatedList={updateElements}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateNote;
