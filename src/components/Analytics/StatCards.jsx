import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";
const StatCards = ({ views, sms }) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <div className="flex flex-col gap-2">
        <div className="p-2 flex flex-row items-center h-[125px] w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
          <div className="flex items-start p-2">
            {views ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-white absolute top-5 text-5xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
              >
                {views?.data?.sorted_total_data?.screen_views_total}
              </motion.div>
            ) : (
              <p className="ml-2">
                <SvgLoader width={"w-10"} height={"h-10"} />
              </p>
            )}
          </div>
          <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
            Total views
          </p>
        </div>
        <div className="p-2 flex flex-row items-center h-[125px] w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
          <div className="flex items-start p-2">
            {views ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-white absolute top-5 text-5xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
              >
                {sms?.click_number ?? 0}
              </motion.div>
            ) : (
              <p className="ml-2">
                <SvgLoader width={"w-10"} height={"h-10"} />
              </p>
            )}
          </div>
          <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
            Total clicks
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="p-2 flex flex-row items-center h-[125px] w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
          <div className="flex items-start p-2">
            {views ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-white absolute top-5 text-5xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
              >
                {sms?.sms_sends ?? 0}
              </motion.div>
            ) : (
              <p className="ml-2">
                <SvgLoader width={"w-10"} height={"h-10"} />
              </p>
            )}
          </div>
          <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
            Total sends
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
