import React, { useEffect, useState } from "react";
import "./PieChart.css";

const HalfPieChart = ({ percentage }) => {
  const angle = (percentage / 100) * 180;
  const describeArc = (angle) => {
    const radius = 65;
    const startX = 75 - radius; // Starting point on the left side of the half-circle
    const startY = 75;

    // End point of the arc, calculated using the angle
    const endX = 75 + radius * Math.cos((angle - 180) * (Math.PI / 180));
    const endY = 75 + radius * Math.sin((angle - 180) * (Math.PI / 180));

    // Large arc flag (1 for >180 degrees, 0 for <=180 degrees)
    const largeArcFlag = angle <= 180 ? 0 : 1;

    // Return the SVG path for the arc
    return `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`;
  };

  return (
    <div className="inline-flex items-center justify-center overflow-hidden">
      <svg
        className="w-[250px] h-[130px] 2xl:h-[180px] 2xl:w-[300px]"
        viewBox="5 -10 140 90"
      >
        <path
          d={describeArc(180)} // Full half-circle as the background
          fill="none"
          className="stroke-gray-300"
          strokeWidth="17"
        />
        {percentage > 0 && (
          <>
            {/* Glow effect arc */}
            <path
              d={describeArc(angle)}
              fill="none"
              className="stroke-purple-600 blur"
              strokeWidth="20"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />

            {/* Foreground progress arc */}
            <path
              d={describeArc(angle)}
              fill="none"
              className="stroke-purple-600"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
      <span className="absolute mt-2 text-xl 2xl:text-2xl font-semibold text-white">{`${
        percentage ?? 0
      }%`}</span>
    </div>
  );
};

export default HalfPieChart;
