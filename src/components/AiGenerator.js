import React, { useState, useEffect, useContext, memo } from "react";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import ButtonComponent from "./ButtonComponent";
import TextComponent from "./TextComponent";
import ImgList from "./ImgList"; // Import your AIComponent

import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";

const AiGenerator = ({
  setComponentState,
  contextList,
  elementList,
  listEl,
}) => {
  const API_KEY = process.env.REACT_APP_OPEN_AI_KEY;
  const { currentUser } = useRedux();
  const { createElement, deleteElement } = useContext(ElementContext);
  const container = document.getElementById("myList");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [image, setImage] = useState("");
  const [file, setFile] = useState();
  const [campaignText, setCampaignText] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [link, setLink] = useState("");
  const [colors, setColor] = useState(["#1F2937", "#0F172A", "#52525B"]);
  const [isMounted, setIsMounted] = useState(true);
  const [headline, setHeadline] = useState("");
  const [isCreated, setIsCreated] = useState(listEl);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState("");
  const text = "Visit";
  // Add other necessary state variables

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setCampaignText([]);
      setImage([]);
      setColor();
      setHeadline();

      try {
        if (isMounted && container) {
          const lastListItem = container?.lastChild;
          setTimeout(() => {
            if (!isCreated) {
              ReactDOM.render(<></>, lastListItem);
            } else {
              ReactDOM.render(<li></li>, container);
            }
          }, 5);
        }
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    setFile(file);

    try {
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCampaignValue = (event) => {
    // Handle description input change
    setCampaignText(event.target.value);
  };

  const handleLinkValue = (event) => {
    // Handle link input change
    setLink(event.target.value);
  };

  const generateAIContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Write me a nice and catchy ad content for ${campaignText} business, keep it short, like three sentances max and dont use quotes.`,
          },
        ],
        max_tokens: 500,
      }),
    };

    let response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    if (response.status === 200) {
      const data = await response.json();

      await addImageElContext();
      await addTextObjContext(data.choices[0].message.content);
      await addButtonObjContext("#000000");

      setGenerated(true);
      setLoading(false);
    }

    // Example: Creating an AI context object
    // contextList((prevElement) => [...prevElement, dataAI]);
    // elementList((prevElement) => [...prevElement, dataAI]);
  };

  let addImageElContext = async (e) => {
    const imageContext = {
      id: Math.floor(Math.random() * 100),
      image: URL.createObjectURL(file),
      element_type: "Img",
      users: currentUser,
      file: file,
      order: 0,
      context: true,
    };
    createElement(imageContext);
    contextList((prevElement) => [...prevElement, imageContext]);
    elementList((prevElement) => [...prevElement, imageContext]);
  };

  let saveImgContext = async () => {
    setImage(URL.createObjectURL(file));
    // Assuming `ColorExtractorComponent` returns a promise
    //await extractColorsFromImage(file);

    setGenerated(true);
    setLoading(false);
    setIsButtonVisible(false);
    setSavedFeedback("Image saved!");
  };

  //   const handleColorExtraction = (color) => {
  //     setColor(color);
  //   };
  //   console.log(savedFeedback);
  //   // Helper function to extract colors from the image using ColorExtractorComponent
  //   const extractColorsFromImage = (imageFile) => {
  //     return new Promise((resolve) => {
  //       ReactDOM.render(
  //         <ColorExtractorComponent
  //           imageSrc={URL.createObjectURL(imageFile)}
  //           returnColors={handleColorExtraction}
  //         />,
  //         document.createElement("div")
  //       );
  //     });
  //   };

  const addButtonObjContext = async (colorValue) => {
    const dataText = {
      id: Math.floor(Math.random() * 100),
      button_title: text,
      button_link: link,
      button_color: colorValue,
      element_type: "Button",
      users: currentUser,
      order: 0,
      context: true,
    };

    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  const addTextObjContext = async (textValue) => {
    const dataText = {
      id: Math.floor(Math.random() * 100),
      text: textValue,
      //alignment: getAlignmentclassName(),
      element_type: "Text",
      users: currentUser,
      order: 0,
      context: true,
    };
    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  const saveAIContent = () => {
    setComponentState(null);
    setGenerated(false);
    if (isMounted) {
      if (!isCreated) {
        if (container) {
          const listItems = Array.from(container?.children);
          listItems?.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              // The element is empty
              // Perform your logic here
              container?.removeChild(listItem);
            }
          });
        }
      }
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageSrc(null);

    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: [0, 0.41, 0.1, 1.01],
      }}
    >
      <label
        className="block mb-2 text-sm font-light text-grayWhite dark:text-white"
        for="file_input"
      >
        Upload file
      </label>

      <div className="flex flex-row">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          onClick={handleRemoveImage}
          data-slot="icon"
          class="w-6 h-6 text-white hover:bg-gray-600/50 cursor-pointer rounded-md"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>

      {file && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: [0, 0.41, 0.1, 1.01],
          }}
          className="mt-2"
        >
          {isButtonVisible && (
            <button
              type="button"
              className={`${
                !file ? "bg-gray-600" : "bg-green-800 hover:bg-green-400"
              }  text-white font-bold py-2 px-4 border border-blue-700 rounded`}
              value={false}
              onClick={saveImgContext}
              style={{ marginRight: "10px" }}
              disabled={file === undefined}
            >
              Save
            </button>
          )}
        </motion.div>
      )}
      <div className="mt-2">
        <input
          type="text"
          onChange={handleCampaignValue}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400/50"
          id="image"
          placeholder="Whats your campaign about? Ex: Nails, Clothing, Wine.."
        />
      </div>
      <div className="mt-2">
        <input
          type="text"
          onChange={handleLinkValue}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400/50"
          id="image"
          placeholder="Insert link to for example: your store, website, product etc.."
        />
      </div>
      <button
        type="button"
        className={`${
          campaignText.length === 0
            ? "bg-gray-600"
            : "bg-green-800 hover:bg-green-400"
        }  text-white font-bold py-2 px-4 border border-blue-700 rounded mt-3`}
        value={false}
        onClick={generateAIContent}
        style={{ marginRight: "10px" }}
        disabled={campaignText.length === 0}
      >
        {loading ? <p>Generating..</p> : <p>Generate</p>}
      </button>
      {!generated ? (
        <></>
      ) : (
        <div className="flex flex-col p-4">
          <p className="text-white/50 font-light">
            If you are satisfied with results click save, otherwise, regenerate.
          </p>
          <button
            type="button"
            className={`${
              !file ? "bg-gray-600" : "bg-green-800 hover:bg-green-400"
            }  text-white font-bold py-2 px-4 border border-blue-700 rounded mt-3`}
            value={false}
            onClick={saveAIContent}
            style={{ marginRight: "10px" }}
            disabled={file === undefined}
          >
            Save
          </button>
        </div>
      )}
      {savedFeedback ?? (
        <div
          class="flex items-center w-32 max-w-xs p-1  bg-green-600 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div class="text-sm text-white font-light">{savedFeedback}</div>
        </div>
      )}
    </motion.div>
  );
};

export default memo(AiGenerator);
