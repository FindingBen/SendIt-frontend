import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";
import ProgressBar from "../Progress/ProgressBar";

const Statistics = ({ views }) => {
  console.log(views);
  return (
    <div className="flex flex-col w-full">
      <p className="text-white text-2xl font-semibold text-justify">
        Other statistics
      </p>
      <div className="p-2 flex flex-col rounded-2xl my-1 relative">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex flex-col p-1 relative">
            <p className="text-white text-normal font-semibold text-justify">
              Bounce rate
            </p>
            <ProgressBar progress={23} />
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
            <ProgressBar />
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
            <ProgressBar />
            {views ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="text-white text-normal font-semibold ml-2 absolute -right-5"
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
    </div>
  );
};

export default Statistics;
