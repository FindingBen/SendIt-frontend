import React, { useEffect, useState } from "react";
import "./PieChart.css";

const PieChart = ({ percentage, viewType }) => {
  const circumference = 65 * 2 * Math.PI;
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const offset = circumference - (percentage / 100) * circumference;
    setDashOffset(offset);
  }, [percentage, circumference]);

  return (
    <div
      className={`flex-none ${
        viewType === "ViewHome" ? "lg:w-64 2xl:w-72" : "bg-slate-800 w-64 h-96"
      } rounded-2xl`}
    >
      <div
        className={`p-2 flex items-center flex-col ${
          viewType === "ViewHome" ? "" : "bg-darkBlue shadow-lg"
        } rounded-2xl mx-3 my-3 relative`}
      >
        <p className="text-white text-xl 2xl:text-2xl font-light text-justify p-4">
          Sms performance
        </p>
        <div className="inline-flex items-center justify-center overflow-hidden rounded-full shadow-2xl">
          <svg className="w-[150px] h-[150px]">
            <circle
              className="text-gray-300 circle-base"
              strokeWidth="17"
              stroke="currentColor"
              fill="transparent"
              r="65"
              cx="75"
              cy="75"
            />
            <circle
              className="text-purple-700 circle-progress"
              strokeWidth="18"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="65"
              cx="75"
              cy="75"
            />
          </svg>
          <span className="absolute text-xl font-semibold text-white">{`${
            percentage ?? 0
          }%`}</span>
        </div>
        {viewType === "AnalyticsView" ? (
          <p className="text-white/50 font-light text-sm p-4">
            Overall performance of the sms including the metrics
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PieChart;
