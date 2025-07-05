import React, { useState } from "react";

const SmsActivityChart = ({ analytics_values }) => {
  // Example hardcoded values (you'll replace these dynamically)
  const totalSent = analytics_values?.total_sends || 0;
  const totalDelivered = analytics_values?.total_delivered || 0;
  const totalUndelivered = analytics_values?.total_undelivered || 0;

  // Calculate percentages safely
  const deliveredPercent =
    totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
  const undeliveredPercent =
    totalSent > 0 ? Math.round((totalUndelivered / totalSent) * 100) : 0;
  const sentPercent = totalSent > 0 ? 100 : 0;
  // Always full circle

  return (
    <div className="bg-[#23253a] p-6 rounded-xl w-full shadow-md">
      <h2 className="text-white text-lg font-euclid mb-4">Sms Activities</h2>
      <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
        {/* Base Circle (Sent) */}
        <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]">
          <circle
            cx="50%"
            cy="50%"
            r="70"
            stroke="#3e6ff4"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - sentPercent / 100)}
          />
        </svg>

        {/* Delivered Circle */}
        <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]">
          <circle
            cx="50%"
            cy="50%"
            r="58"
            stroke="#4937BA"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 58}
            strokeDashoffset={2 * Math.PI * 58 * (1 - deliveredPercent / 100)}
          />
        </svg>

        {/* Undelivered Circle */}
        <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]">
          <circle
            cx="50%"
            cy="50%"
            r="46"
            stroke="#00d4ff"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - undeliveredPercent / 100)}
          />
        </svg>

        {/* Center Text */}
        <div className="text-white text-center z-10">
          <p className="text-sm">SMS Sent</p>
          <p className="text-3xl font-bold">{totalSent}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-sm text-white">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3e6ff4]"></span>
          Sent
          <span className="ml-1 font-bold">{totalSent}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#4937BA]"></span>
          Delivered
          <span className="ml-1 font-bold">{totalDelivered}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00d4ff]"></span>
          Undelivered
          <span className="ml-1 font-bold">{totalUndelivered}</span>
        </div>
      </div>
    </div>
  );
};

export default SmsActivityChart;
