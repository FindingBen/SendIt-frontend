import React from "react";

const LoaderSkeleton = ({ div_size, contact_list = false }) => {
  const skeletons = Array.from({ length: div_size });
  return (
    <div
      role="status"
      class="max-w p-4 space-y-4 divide-y animate-pulse divide-gray-700 md:p-6"
    >
      {skeletons.map((_, index) => (
        <div
          id="main"
          key={index} // Add a unique key for each skeleton
          className="flex items-center justify-between"
        >
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          <div
            className={`h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12 ${
              contact_list ? "hidden" : "block"
            }`}
          ></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </div>
      ))}
    </div>
  );
};

export default LoaderSkeleton;
