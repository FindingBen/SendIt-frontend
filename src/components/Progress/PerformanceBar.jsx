import React from "react";

const PerformanceBar = ({ performance }) => {
  const getPerformanceColor = (performance) => {
    if (performance < 50) return "bg-red-600 dark:bg-red-500";
    if (performance >= 50 && performance <= 75)
      return "bg-yellow-600 dark:bg-yellow-500";
    return "bg-green-600 dark:bg-green-500";
  };
  return (
    <div class="w-[100%] relative bg-gray-200 rounded-full h-2 2xl:h-4 dark:bg-gray-700 mt-1 mx-1">
      <div
        className={`${getPerformanceColor(
          performance
        )} h-2 2xl:h-4 rounded-full`}
        style={{ width: `${performance}%` }} // Ensure the width is a percentage
      ></div>
      <p
        className={`absolute inset-0 blur`}
        style={{ width: `${performance}%` }}
      ></p>
    </div>
  );
};

export default PerformanceBar;
