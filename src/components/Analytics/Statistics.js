import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";
import ProgressBar from "../Progress/ProgressBar";

const Statistics = ({ views }) => {
  return (
    <div className="p-4 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 w-[100%] h-full flex flex-col rounded-2xl relative">
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-col p-1 relative">
          <p className="text-white text-normal font-semibold text-justify">
            Bounce rate
          </p>
          <ProgressBar progress={views?.data.sorted_total_data.bounceRate} />
          {views ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-normal font-semibold ml-2 absolute right-0"
            >
              {views?.data.sorted_total_data.bounceRate} %
            </motion.div>
          ) : (
            <p className="text-white font-semibold absolute right-5">
              <SvgLoader width={"w-5"} height={"h-5"} />
            </p>
          )}
        </div>
        <div className="flex flex-col p-1 relative">
          <p className="text-white text-normal font-semibold text-justify">
            Engagement rate
          </p>
          <ProgressBar
            progress={views?.data.sorted_total_data.engegment_rate_total}
          />
          {views ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-normal font-semibold ml-2 absolute right-0"
            >
              {views?.data.sorted_total_data.engegment_rate_total} %
            </motion.div>
          ) : (
            <p className="text-white font-semibold absolute right-5">
              <SvgLoader width={"w-5"} height={"h-5"} />
            </p>
          )}
        </div>

        <div className="flex flex-col p-1 relative">
          {" "}
          <p className="text-white text-normal font-semibold text-justify">
            Performance
          </p>
          <ProgressBar progress={views?.data.overall_perf} />
          {views ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-normal font-semibold ml-2 absolute right-0"
            >
              {views?.data.overall_perf} %
            </motion.div>
          ) : (
            <p className="text-white font-semibold absolute right-5">
              <SvgLoader width={"w-5"} height={"h-5"} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
