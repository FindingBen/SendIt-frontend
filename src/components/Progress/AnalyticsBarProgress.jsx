import React from "react";

const AnalyticsBarProgress = ({ total_values, metric }) => {
  const getProgressColor = (percentage, metricType) => {
    if (metricType === "Bounce Rate") {
      if (percentage <= 25) return "bg-green-600 dark:bg-green-500";
      if (percentage <= 55) return "bg-yellow-500 dark:bg-yellow-400";
      return "bg-red-600 dark:bg-red-500";
    }

    // Default case for clicks_rate or other metrics
    if (percentage <= 50) return "bg-red-600 dark:bg-red-500";
    if (percentage <= 70) return "bg-yellow-500 dark:bg-yellow-400";
    return "bg-green-600 dark:bg-green-500";
  };
  console.log(total_values);
  const cappedValue = Math.min(total_values || 0, 100);
  const progressColor = getProgressColor(cappedValue, metric);

  return (
    <div className="flex flex-col w-[70%]">
      <p className="text-white/80 text-lg text-start">{metric}</p>

      <div class="w-[100%] relative bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2">
        <div
          className={`${progressColor} h-3 rounded-full`}
          style={{ width: cappedValue + "%" }}
        ></div>
        <p
          className={`absolute inset-0 ${progressColor} blur`}
          style={{ width: cappedValue + "%" }}
        ></p>
      </div>
    </div>
  );
};

export default AnalyticsBarProgress;
