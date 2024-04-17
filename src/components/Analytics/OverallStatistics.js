import React from "react";
import SvgLoader from "../SvgLoader";
import { motion } from "framer-motion";

const OverallStatistics = ({ totalValues }) => {
  return (
    <div className="flex w-[72%] gap-4">
      <div className="flex flex-row items-center lg:w-[275px] h-[120px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          <p className="text-white text-xl lg:text-normal font-light text-justify">
            Total sends
          </p>
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white lg:text-2xl font-normal"
            >
              {totalValues.total_sends ?? 0}
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center lg:w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          <p className="text-white text-xl font-light text-justify">
            Total Views
          </p>
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white lg:text-2xl font-normal"
            >
              {totalValues.total_views ?? 0}
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center lg:w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          <p className="text-white text-xl font-light text-justify">
            Bounce Rate
          </p>
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white lg:text-2xl font-normal flex flex-row"
            >
              {totalValues.average_bounce_rate ?? 0}
              <p className="lg:text-xl font-light">%</p>
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center lg:w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
        <div className="p-2 flex items-start flex-col rounded-md mx-2 my-auto">
          <p className="text-white text-xl font-light text-justify">
            Overall rate
          </p>
          {totalValues ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="text-white lg:text-2xl font-light flex flex-row"
            >
              {totalValues.average_overall_rate ?? 0}
              <p className="lg:text-xl font-light">%</p>
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverallStatistics;
