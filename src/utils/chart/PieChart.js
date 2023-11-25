import React, { useEffect, useState } from "react";
import "./PieChart.css";

const PieChart = ({ percentage }) => {
  const circumference = 65 * 2 * Math.PI;
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const offset = circumference - (percentage / 100) * circumference;
    setDashOffset(offset);
  }, [percentage, circumference]);

  return (
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
  );
};

export default PieChart;
