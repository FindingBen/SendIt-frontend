import React from "react";
import SvgLoader from "../SvgLoader";
import { motion } from "framer-motion";

const OverallStatistics = ({ totalValues, messageCount }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-none">
        <div className="flex flex-col h-40 w-[305px] bg-darkestGray rounded-md">
          <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-blue-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>

            {totalValues ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-gradient text-6xl font-light ml-2"
              >
                {messageCount ?? 0}
              </motion.div>
            ) : (
              <p className="text-white font-semibold text-6xl ml-2">
                <SvgLoader width={"w-8"} height={"h-8"} />
              </p>
            )}

            <p className="text-white text-2xl font-light text-justify ml-3">
              Sent <br></br>messages
            </p>
          </div>
        </div>
      </div>
      <div className="flex-none">
        <div className="flex flex-col h-40 w-[305px] bg-darkestGray rounded-md">
          <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {totalValues ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-gradient text-6xl font-light ml-2"
              >
                {totalValues.total_views ?? 0}
              </motion.div>
            ) : (
              <p className="text-white font-semibold text-4xl ml-2">
                <SvgLoader width={"w-8"} height={"h-8"} />
              </p>
            )}
            <p className="text-white text-2xl font-light text-justify ml-3">
              Total <br></br>Views
            </p>
          </div>
        </div>
      </div>
      <div className="flex-none">
        <div className="flex flex-col h-40 w-[305px] bg-darkestGray rounded-md">
          <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 text-red-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {totalValues ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-gradient-red text-6xl font-light ml-2 flex flex-row"
              >
                {totalValues.average_bounce_rate ?? 0}
                <p className="text-4xl font-light">%</p>
              </motion.div>
            ) : (
              <p className="text-white font-semibold text-4xl ml-2">
                <SvgLoader width={"w-8"} height={"h-8"} />
              </p>
            )}
            <p className="text-white text-2xl font-light text-justify ml-2">
              Bounce <br></br>Rate
            </p>
          </div>
        </div>
      </div>
      <div className="flex-none">
        <div className="flex flex-col h-40 w-[305px] bg-darkestGray rounded-md">
          <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-green-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
            {totalValues ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-gradient-green text-6xl font-light ml-2 flex flex-row"
              >
                {totalValues.average_overall_rate ?? 0}
                <p className="text-4xl font-light">%</p>
              </motion.div>
            ) : (
              <p className="text-white font-semibold text-4xl ml-2">
                <SvgLoader width={"w-8"} height={"h-8"} />
              </p>
            )}
            <p className="text-white text-2xl font-light text-justify ml-3">
              Overall <br></br>rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallStatistics;