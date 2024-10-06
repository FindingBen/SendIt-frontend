import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";

const SendingStats = ({ sms_stats }) => {
  return (
    <div className="flex bg-slate-800 rounded-2xl p-2">
      <div className="flex flex-row items-center w-[275px] rounded-2xl">
        <div className="flex-none p-3 my-auto bg-darkBlue rounded-full ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 2xl:w-8 2xl:h-8 text-white mx-auto my-auto"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </div>
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          <p className="text-white text-normal 2xl:text-2xl font-light text-justify">
            Sent messages
          </p>
          {sms_stats ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-2xl 2xl:text-3xl font-normal"
            >
              {sms_stats.sent_numbers}
            </motion.div>
          ) : (
            <p className="text-white font-semibold text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendingStats;
