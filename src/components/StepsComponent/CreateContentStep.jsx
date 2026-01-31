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
import Loader from "../LoaderSkeleton/Loader";
import PreviewPanel from "../PreviewComponent/PreviewPanel";
import ContentButton from "./ChildComponents/ContentButton";
import ImageIcon from "../../assets/menuAssets/iconComponents/ImageIcon";
import ButtonIcon from "../../assets/menuAssets/iconComponents/ButtonIcon";
import SurveyIcon from "../../assets/menuAssets/iconComponents/SurveyIcon";
import TextIcon from "../../assets/menuAssets/iconComponents/TextIcon";
import AiIcon from "../../assets/menuAssets/iconComponents/AiIcon";
import Carouselicon from "../../assets/menuAssets/iconComponents/Carouselicon";

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
  const [loadingStep, setLoadingStep] = useState(false);
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
  const gold_package = process.env.REACT_APP_GOLD_PLAN;
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
    setLoadingStep(true);
    setTimeout(() => {
      setLoadingStep(false);
      nextStep();
    }, 1000);
  };

  const handleClick = (componentKey) => {
    setSelectedComponent((prevSelectedComponent) =>
      prevSelectedComponent === componentKey ? null : componentKey
    );
  };

  const handleContextEl = (elementContextList) => {
    setElementsContextList(elementContextList);
  };

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
        handleFiles={handleFiles}
        setComponentState={setComponent}
        productImages={initialData?.product?.images}
      />
    ),
  };

  return (
    <section className="flex flex-col h-screen w-full overflow-hidden bg-[#0A0E1A]">
  <div className="flex flex-col md:flex-row h-full">
    
    {/* Sidebar: Content Elements */}
    <aside className="flex flex-col bg-gradient-to-b from-lighterMainBlue to-mainBlue border-r-2 border-gray-800 p-6 gap-4 w-full md:w-72">
      <h2 className="text-white text-lg font-semibold mb-4 text-left">Content Elements</h2>

      <div className="flex flex-wrap gap-3">
        <ContentButton
          icon={ImageIcon}
          label="Image"
          onClick={() => !imageStateVal && handleClick("image")}
          disabled={imageStateVal}
        />
        <ContentButton
          icon={ButtonIcon}
          label="CTA"
          onClick={() => !imageStateVal && handleClick("button")}
          disabled={imageStateVal}
        />
        <ContentButton
          icon={TextIcon}
          label="Text"
          onClick={() => !imageStateVal && handleClick("text")}
          disabled={imageStateVal}
        />
        <ContentButton
          icon={SurveyIcon}
          label="Survey"
          onClick={() => !imageStateVal && handleClick("survey")}
          disabled={imageStateVal}
        />
        <ContentButton
          icon={AiIcon}
          label="AI"
          onClick={() =>
            currentPackageState?.package === gold_package && !imageStateVal
              ? handleClick("aiContent")
              : null
          }
          disabled={currentPackageState?.package !== gold_package || imageStateVal}
        />
        {currentShopifyToken && (
          <ContentButton
            icon={Carouselicon}
            label="Carousel"
            onClick={() => !imageStateVal && handleClick("carousel")}
            disabled={imageStateVal}
          />
        )}
      </div>
    </aside>

    {/* Builder Area */}
    <main className="flex-1 relative flex flex-col justify-between overflow-y-auto px-10 py-6 mx-10">
      <div className="mb-6">
        {selectedComponent && componentsMap[selectedComponent]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center mt-auto mb-10">
        {loadingStep ? (
          <Loader loading_name="Next step..." />
        ) : (
          <>
            <button
              onClick={prevStep}
              className="bg-ngrokBlue hover:bg-ngrokBlue/70 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={elementContextList.length === 0}
              className={`py-2 px-6 rounded-lg font-medium text-white transition ${
                elementContextList.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-ngrokBlue hover:bg-ngrokBlue/70"
              }`}
            >
              Next
            </button>
          </>
        )}
      </div>
    </main>

    {/* Preview Panel */}
    <aside className="hidden md:flex md:w-96 p-6 bg-[#0A0E1A] mx-40">
      <PreviewPanel
        device={device}
        handleClicked={handleClicked}
        elementContextList={elementContextList}
        updateElements={updateElements}
        newLook={true}
      />
    </aside>
  </div>
</section>

  );
};

export default CreateContentStep;
