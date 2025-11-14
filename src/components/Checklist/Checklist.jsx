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

  return (
    <div className="bg-[#111827] border-2 border-gray-800 rounded-2xl p-4">
  <p className="text-gray-400 text-sm mb-3 text-start">
    Make sure all fields are green to utilize the full SMS sending capabilities! The (*) indicates required fields.
  </p>
  
  <ul className="space-y-2">
    <li className="flex items-center gap-2">
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isListSelected ? "text-green-500" : "text-gray-500"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
      <span className={`${isListSelected ? "text-white" : "text-gray-400"} font-medium`}>
        Select list *
      </span>
    </li>

    <li className="flex items-center gap-2">
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isTextWritten ? "text-green-500" : "text-gray-500"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
      <span className={`${isTextWritten ? "text-white" : "text-gray-400"} font-medium`}>
        Write your message *
      </span>
    </li>

    <li className="flex items-center gap-2">
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isLinked ? "text-green-500" : "text-gray-500"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
      <span className={`${isLinked ? "text-white" : "text-gray-400"} font-medium`}>
        Link your campaign
      </span>
    </li>

    <li className="flex items-center gap-2">
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isPersonalized ? "text-green-500" : "text-gray-500"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
      <span className={`${isPersonalized ? "text-white" : "text-gray-400"} font-medium`}>
        Personalize your message
      </span>
    </li>
  </ul>
</div>

  );
};

export default Checklist;
