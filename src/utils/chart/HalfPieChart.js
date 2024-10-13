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
      <svg className="w-[250px] h-[130px]" viewBox="5 -10 140 90">
        {/* Background half-circle (gray) */}
        <path
          d={describeArc(180)} // Full half-circle as the background
          fill="none"
          className="stroke-gray-300"
          strokeWidth="17"
        />
        {/* Foreground progress arc (purple) */}
        <path
          d={describeArc(angle)} // Arc based on the percentage
          fill="none"
          className="stroke-purple-600"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute mt-2 text-xl font-semibold text-white">{`${
        percentage ?? 0
      }%`}</span>
    </div>
  );
};

export default HalfPieChart;
