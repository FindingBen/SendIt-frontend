import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div class="w-[100%] relative bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-1 mx-1">
      <div
        className={`bg-purple-600 h-2 rounded-full dark:bg-purple-500`}
        style={{ width: progress }}
      ></div>
      <p
        className={`absolute inset-0 bg-purple-600 blur`}
        style={{ width: progress }}
      ></p>
    </div>
  );
};

export default ProgressBar;
