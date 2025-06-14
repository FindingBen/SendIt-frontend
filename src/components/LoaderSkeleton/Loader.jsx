import React from "react";

const Loader = ({ loading_name, color }) => {
  return (
    <div className="flex items-center gap-2 py-4">
      <svg
        className={`animate-spin h-6 w-6 ${
          color ? "text-gray-700" : "text-ngrokBlue"
        }`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <span className={`${color ? "text-gray-600" : "text-gray-200/70"}`}>
        {loading_name}...
      </span>
    </div>
  );
};

export default Loader;
