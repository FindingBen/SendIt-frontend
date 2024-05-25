import React, { useState, useEffect } from "react";

const Checklist = ({
  isListSelected,
  isTextWritten,
  isLinked,
  isPersonalized,
}) => {
  const [istext, setIsText] = useState(isTextWritten);
  useEffect(() => {
    setIsText(isTextWritten);
  }, [isTextWritten]);
  console.log(isPersonalized);
  return (
    <div className="border-b-2 border-gray-800">
      <p className="text-white/50 text-sm text-justify my-2">
        Make sure all fields are green to utilize the full sms sending
        capabilities! The (*) indicates that fields are rquired!
      </p>
      <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        <li class="flex items-center">
          <svg
            class={`w-3.5 h-3.5 me-2 ${
              isListSelected ? "text-green-600" : "text-gray-500"
            } flex-shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          Select list *
        </li>
        <li class="flex items-center">
          <svg
            class={`w-3.5 h-3.5 me-2 ${
              isTextWritten ? "text-green-600" : "text-gray-500"
            } flex-shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          Write your message *
        </li>
        <li class="flex items-center">
          <svg
            class={`w-3.5 h-3.5 me-2 ${
              isLinked ? "text-green-600" : "text-gray-500"
            } flex-shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          Link your campaign
        </li>
        <li class="flex items-center">
          <svg
            class={`w-3.5 h-3.5 me-2 ${
              isPersonalized ? "text-green-600" : "text-gray-500"
            } flex-shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          Personalize your message
        </li>
      </ul>
    </div>
  );
};

export default Checklist;
