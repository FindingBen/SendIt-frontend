import React from "react";
import SvgLoader from "../SvgLoader";
import { motion } from "framer-motion";

const OverallStatistics = ({ totalValues }) => {
  return (
    <div className="flex w-full gap-4">
      <div className="flex flex-row items-center lg:w-[275px] h-[120px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-5xl font-normal absolute top-5"
            >
              {totalValues.total_sends ?? 0}
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
          <p className="text-white text-normal lg:text-normal font-semibold text-justify absolute right-2 bottom-2">
            Total Sends
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center lg:w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-5xl font-semibold absolute top-5"
            >
              {totalValues.total_views ?? 0}
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
          <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
            Total Views
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center lg:w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white text-5xl font-semibold absolute top-5 flex flex-row"
            >
              {totalValues.average_overall_rate ?? 0}
              <p className="lg:text-xl font-light">%</p>
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
          <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
            Overall Rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverallStatistics;
