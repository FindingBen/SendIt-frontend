import React, { useContext, useState, useEffect } from "react";
import Image from "../Image";
import Text from "../Text";
import Button from "../Button";
import Survey from "../Survey/Survey";
import AiGenerator from "../AiGenerator";
import { setOpenModal } from "../../redux/reducers/modalReducer";
import { setState } from "../../redux/reducers/formReducer";
import { ElementContext } from "../../context/ElementContext";
import Carousel from "../Carousel/Carousel";
import { useRedux } from "../../constants/reduxImports";
import SvgLoader from "../SvgLoader";
import PreviewPanel from "../PreviewComponent/PreviewPanel";
const CreateContentStep = ({
  prevStep,
  nextStep,
  updateFormData,
  initialData,
}) => {
  const [messageElements, setMessageElements] = useState([]);
  const { deleteElement } = useContext(ElementContext);
  const {
    currentUser,
    dispatch,
    currentModalState,
    currentShopifyToken,
    currentPackageState,
    currentMessages,
  } = useRedux();
  const [images, setImages] = useState([]);
  const [file, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayElItem, setDisplayItems] = useState([]);
  const [elementsList, setElementsList] = useState([]);
  const [cardComponent, setCardComponent] = useState(false);
  const [elementContextList, setElementsContextList] = useState(
    [] // Initialize with existing data if available
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageStateVal, setImageStateVal] = useState(false);
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

  const handleNext = () => {
    updateFormData({ contentElements: elementContextList }); // Explicitly update the contentElements key
    nextStep();
  };
  console.log(elementContextList);
  const handleClick = (componentKey) => {
    setSelectedComponent((prevSelectedComponent) =>
      prevSelectedComponent === componentKey ? null : componentKey
    );
  };

  const handleContextEl = (elementContextList) => {
    setElementsContextList(elementContextList);
  };
  console.log(elementContextList);
  const handleStepList = (messageElements) => {
    setMessageElements(messageElements);
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
        stepList={handleStepList}
      />
    ),
    text: (
      <Text
        elementList={displayElements}
        listEl={isCreate}
        contextList={handleContextEl}
        setComponentState={setComponent}
        stepList={handleStepList}
      />
    ),
    button: (
      <Button
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
        stepList={handleStepList}
      />
    ),
    survey: (
      <Survey
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
        stepList={handleStepList}
      />
    ),
    aiContent: (
      <AiGenerator
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
        stepList={handleStepList}
      />
    ),
    carousel: (
      <Carousel
        listEl={isCreate}
        contextList={handleContextEl}
        elementList={displayElements}
        setComponentState={setComponent}
        productImages={initialData?.product?.images}
      />
    ),
  };

  return (
    <section className="max-h-screen w-full items-center justify-center">
      <div className="flex flex-col max-h-screen">
        <div className="flex flex-col md:flex-row rounded-2xl h-screen">
          <div className="flex p-10 max-h-screen gap-2 md:flex-col bg-gradient-to-b from-lighterMainBlue to-mainBlue border-r-2 border-gray-800">
            <span className="text-left text-white text-normal lg:text-lg font-semibold ml-4 md:ml-0">
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
            <div className="flex flex-row justify-between mt-2">
              <div
                onClick={
                  currentPackageState?.package === "Silver" && !imageStateVal
                    ? () => handleClick("aiContent")
                    : null
                }
                name="liClick"
                className={`component-button-create-content ${
                  currentPackageState?.package !== "Silver"
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5 lg:h-8 lg:w-8 text-white/70"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>

                <p className="text-white/70 font-base text-normal text-justify my-auto">
                  AI
                </p>
              </div>
              {currentShopifyToken ? (
                <div
                  onClick={imageStateVal ? null : () => handleClick("carousel")}
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
                    Carousel
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="w-[100%]">
            <div className="items-center mx-20 mt-5">
              {selectedComponent && componentsMap[selectedComponent]}
            </div>
            <div className="flex flex-row gap-2 absolute bottom-10 left-[39%]">
              <button
                type="submit"
                onClick={prevStep}
                // disabled={elementContextList.length === 0} // Disable if name or type is empty
                className={`text-white mx-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
             
                bg-cyan-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300"
            `}
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handleNext}
                disabled={elementContextList.length === 0} // Disable if name or type is empty
                className={`text-white mx-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                  elementContextList.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          <div className="p-10">
            <PreviewPanel
              device={device}
              handleClicked={handleClicked}
              elementContextList={elementContextList}
              updateElements={updateElements}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateContentStep;
