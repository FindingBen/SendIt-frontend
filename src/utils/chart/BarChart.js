import React from "react";
import { motion } from "framer-motion";

const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  const getBarColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#3e6ff4"; // Blue
      case "Undelivered":
        return "red"; // Red
      default:
        return "#ccc"; // Default fallback
    }
  };

  return (
    <div className="p-4 bg-[#23253a] border-2 border-gray-800 rounded-lg w-[60%] h-72 2xl:h-[380px] relative">
      <div className="flex justify-between items-center mb-4">
        <p className="text-white text-lg font-normal">Sms Delivery</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </div>

      <div className="flex items-end justify-around h-[calc(100%-3rem)]">
        {data.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center h-full">
            <div className="relative h-full w-10 flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${(d.value / max) * 100}%`,
                }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="w-full rounded-md"
                style={{
                  backgroundColor: getBarColor(d.status),
                }}
              />
            </div>
            <p className="mt-2 text-white text-sm text-center">{d.status}</p>
            <p className="text-gray-300 text-xs">{d.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
