import React, { useState, useEffect, useContext, memo } from "react";
import ReactDOM from "react-dom";
import { ElementContext } from "../context/ElementContext";
import ColorExtractor from "./ColorExtractor/ColorExtractor";
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
  const [link, setLink] = useState("");
  const [colors, setColor] = useState([]);
  const { v4: uuidv4 } = require("uuid");
  const [isMounted, setIsMounted] = useState(true);
  const [headline, setHeadline] = useState("");
  const [isCreated, setIsCreated] = useState(listEl);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const [progress, setProgress] = useState(0);
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

  useEffect(() => {}, [progress, isButtonVisible]);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    setFile(file);
    setIsButtonVisible(true);
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

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 15; // You can adjust the step as needed
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(interval);
          addImageElContext();
          addTextObjContext(data.choices[0].message.content);
          addButtonObjContext();
          setGenerated(true);
          setLoading(false);
          setComponentState(null);
        }
      }, 500);
    }
  };

  let addImageElContext = async (e) => {
    const imageContext = {
      unique_button_id: uuidv4(),
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

  let saveImgContext = (e) => {
    setImage(URL.createObjectURL(file));
    // Assuming `ColorExtractorComponent` returns a promise
    extractColorsFromImage(file);
    setTimeout(() => console.log("extracting colors.."), 1000);

    setLoading(false);
    setIsButtonVisible(false);
  };

  const handleColorExtraction = (color) => {
    const randomColor = color[Math.floor(Math.random() * color.length)];

    setColor(randomColor);
  };

  // Helper function to extract colors from the image using ColorExtractorComponent
  const extractColorsFromImage = (imageFile) => {
    return new Promise((resolve) => {
      ReactDOM.render(
        <ColorExtractor
          src={URL.createObjectURL(imageFile)}
          getColors={handleColorExtraction}
        />,
        document.createElement("div")
      );
    });
  };

  const addButtonObjContext = async () => {
    const dataText = {
      id: Math.floor(Math.random() * 100),
      button_title: text,
      button_link: link,
      button_color: colors.substring(1),
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

  function handleCancel(event) {
    setComponentState(null);
    if (isMounted) {
      const container = document.getElementById("myList");
      if (!isCreated) {
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

  const handleRemoveImage = () => {
    setFile(null);

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
      <div className="flex flex-col items-start">
        <label
          className="mb-2 text-sm font-light text-grayWhite dark:text-white"
          for="file_input"
        >
          Upload file
        </label>

        <div className="flex flex-row w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm p-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
            disabled={file === undefined}
            className={`w-6 h-6 my-auto ml-1 ${
              file
                ? "text-white cursor-pointer hover:bg-gray-600/50"
                : "text-white/50"
            }  rounded-md`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
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
          className="mt-2 flex items-start"
        >
          {isButtonVisible && (
            <button
              type="button"
              className={`${
                !file ? "bg-gray-600" : "bg-green-800 hover:bg-green-400"
              }  text-white font-bold py-2 px-4 border border-blue-700 rounded`}
              value={false}
              onClick={(e) => saveImgContext(e)}
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
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image"
          placeholder="Whats your campaign about? Ex: Nails, Clothing, Wine.."
        />
      </div>
      <div className="mt-2">
        <input
          type="text"
          onChange={handleLinkValue}
          className="block w-full text-sm p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image"
          placeholder="Insert link to for example: your store, website, product etc.."
        />
      </div>
      {!loading ? (
        <div className="flex flex-row">
          <button
            type="button"
            className={`${
              campaignText.length === 0
                ? "bg-gray-600"
                : "bg-green-800 hover:bg-green-400"
            }  text-white font-bold py-2 px-4 border border-blue-700 rounded mt-3`}
            value={false}
            onClick={generateAIContent}
            disabled={campaignText.length === 0}
          >
            Generate
          </button>
          <button
            type="button"
            className="bg-red-800 hover:bg-red-400 text-white font-bold py-2 px-4 border mt-3 ml-3 border-blue-700 rounded"
            id="cancel"
            value={false}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-4">
            <div
              style={{ width: `${progress}%` }}
              className={`bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all duration-500 ease-in-out`}
            >
              {" "}
              {progress}%
            </div>
          </div>
          <p className="text-white">Generating..</p>
        </div>
      )}
      {!generated ? (
        <></>
      ) : (
        <div className="flex flex-col p-4 items-center">
          <p className="text-white/50 font-light">
            If you are satisfied with results click save, otherwise, regenerate.
          </p>
          <div className="flex flex-row gap-2">
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
        </div>
      )}
    </motion.div>
  );
};

export default memo(AiGenerator);
