import React, { useState, useEffect, useContext, memo } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import ColorPircker from "../ColorPircker";
import SurveyComponent from "./SurveyComponent";
import { ElementContext } from "../../context/ElementContext";
import { useRedux } from "../../constants/reduxImports";

const Survey = ({ setComponentState, contextList, elementList, listEl }) => {
  const { currentUser } = useRedux();
  const { createElement, deleteElement } = useContext(ElementContext);
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("");
  const container = document.getElementById("myList");
  const [isMounted, setIsMounted] = useState(true);
  const [color, setColor] = useState("");
  const [isCreated, setIsCreated] = useState(listEl);

  function handleResponse() {
    console.log("response");
  }

  useEffect(() => {
    try {
      const lastListItem = container?.lastChild;
      setTimeout(() => {
        if (!isCreated) {
          ReactDOM.render(
            <SurveyComponent
              questionValue={question}
              questionTypeValue={questionType}
              colorValue={color}
              onSubmit={handleResponse}
            />,
            lastListItem
          );
        } else {
          ReactDOM.render(
            <SurveyComponent
              questionValue={question}
              questionTypeValue={questionType}
              colorValue={color}
              onSubmit={handleResponse}
            />,
            container
          );
        }
      }, 5);
    } catch (error) {
      console.log(error);
    }
  }, [question, questionType, color, container]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setQuestion("");
      setQuestionType("");
      setColor("");
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
        console.log(error);
      }
    };
  }, []);

  function handleQuestionValue(event) {
    setQuestion(event.target.value);
  }

  function handleQuestionTypeValue(event) {
    setQuestionType(event.target.value);
  }

  const handleColor = (color) => {
    setColor(color);
  };

  const addSurveyObjContext = () => {
    const dataText = {
      id: Math.floor(Math.random() * 100),
      survey: question,
      question_type: questionType,
      element_type: "Survey",
      users: currentUser,
      order: 0,
      context: true,
    };

    createElement(dataText);
    contextList((prevElement) => [...prevElement, dataText]);
    elementList((prevElement) => [...prevElement, dataText]);
  };

  function saveSurvey(event) {
    setComponentState(null);
    addSurveyObjContext();
    if (isMounted) {
      const container = document.getElementById("myList");
      if (!isCreated) {
        const listItems = Array.from(container?.children);
        listItems.forEach((listItem) => {
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
      <div className="flex-1">
        <label
          for="first_name"
          className="block mb-2 text-sm font-light text-grayWhite dark:text-white"
        >
          Write your question
        </label>
        <input
          onChange={handleQuestionValue}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label
          for="first_name"
          className="block mb-2 mt-3 text-sm font-light text-grayWhite dark:text-white"
        >
          Choose question type
        </label>
        <select
          id="questionType"
          onChange={handleQuestionTypeValue}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select a question type</option>
          <option value="Like/Dislike">Like/Dislike</option>
          <option value="Question Survey">Question Survey</option>
        </select>
        <div className="mt-3 flex flex-row relative">
          <button
            type="button"
            className="bg-green-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            value={false}
            onClick={saveSurvey}
            style={{ marginRight: "10px" }}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-red-800 hover:bg-red-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            id="cancel"
            value={false}
            onClick={handleCancel}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </button>
          <div className="absolute top-0 right-0">
            <ColorPircker colorValue={handleColor} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Survey;
