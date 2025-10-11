import React, { useState, useEffect } from "react";
import { config } from "../../constants/Constants";

const SurveyComponent = ({
  colorValue,
  questionValue,
  questionTypeValue,
  onSubmit,
  element_id,
}) => {
  const BASE_URL = config.url.BASE_URL;
  const [question, setQuestion] = useState(questionValue);

  const [questionType, setQuestionType] = useState(questionTypeValue);
  const [color, setColor] = useState(colorValue);
  const [response, setResponse] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setQuestion(questionValue);
    setQuestionType(questionTypeValue);
  }, [questionValue, questionTypeValue]);

  useEffect(() => {
    setColor(colorValue);
  }, [colorValue, color]);

  const handleLikeDislikeClick = async (response) => {
    let data = {
      response_type: response,
      survey_type: "Like/Dislike",
    };

    let api_response = await fetch(
      `${BASE_URL}/api/handle_survey/${element_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (api_response.status === 200) {
      setResponse(response);
      setFeedback("Thank you for your feedback!");
    }
  };

  const handleNumericSubmit = async () => {
    let data = {
      response_type: response,
      survey_type: "Q Survey",
    };
    let api_response = await fetch(
      `${BASE_URL}/api/handle_survey/${element_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (api_response.status === 200) {
      setResponse(response);
      setFeedback("Thank you for your feedback!");
    }
  };

  return (
    <div
  className="flex flex-col items-center mx-2 rounded-md shadow-md"
  style={{ backgroundColor: color ? `#${color}` : "#fff" }}
>
      <div className="flex-1 p-4 w-48 text-center">
        <p className="text-black text-xl break-words whitespace-normal text-center">{question}</p>
        {questionType === "Like/Dislike" && !response && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleLikeDislikeClick("like")}
              className="border-2 border-gray-400 text-white text-xl px-4 py-2 rounded"
            >
              👍
            </button>
            <button
              onClick={() => handleLikeDislikeClick("dislike")}
              className="border-2 border-gray-400 text-white text-xl px-4 py-2 rounded"
            >
              👎
            </button>
          </div>
        )}
        {questionType === "Question Survey" && !response && (
          <div className="flex flex-col mt-4 mx-2 bg-gray-500">
            <input
              type="number"
              placeholder="Enter numeric value"
              className="border border-gray-300 px-4 py-2 rounded"
            />
            <button
              onClick={handleNumericSubmit}
              className="bg-cyan-600 hover:bg-cyan-400 text-white px-4 py-2 mx-5 mt-2 rounded"
            >
              Submit
            </button>
          </div>
        )}
        {feedback && <p className="mt-4">{feedback}</p>}
      </div>
    </div>
  );
};

export default SurveyComponent;
