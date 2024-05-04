import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";

const SurveyResults = ({ surveyResults }) => {
  return (
    <div className="p-2 items-start h-72 w-[35%] flex-col rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
      <div className="flex flex-row">
        <p className="text-white text-lg font-light text-justify p-4">
          Survey results
        </p>
        <div className="absolute right-4 top-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
            />
          </svg>
        </div>
      </div>

      {!surveyResults === false ? (
        <div className="flex flex-col p-4 w-full">
          <div className="flex flex-row p-1 relative">
            <p className="text-white text-xl font-light text-justify">Like</p>
            {surveyResults ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-gradient-white text-xl font-light absolute right-0"
              >
                {surveyResults.like_response}
              </motion.div>
            ) : (
              <p className="text-white font-semibold absolute right-5">
                <SvgLoader width={"w-5"} height={"h-5"} />
              </p>
            )}
          </div>
          <div className="flex flex-row p-1 relative">
            <p className="text-white text-xl font-light text-justify">
              Dislike
            </p>
            {surveyResults ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-gradient-white text-xl font-light absolute right-0"
              >
                {surveyResults.dislike_response}
              </motion.div>
            ) : (
              <p className="text-white font-semibold absolute right-5">
                <SvgLoader width={"w-5"} height={"h-5"} />
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mx-auto mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-12 h-12 text-white/50 mx-auto"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>
          <p className="text-white/50 font-light text-small">
            No survey for this message..
          </p>
        </div>
      )}
    </div>
  );
};

export default SurveyResults;
