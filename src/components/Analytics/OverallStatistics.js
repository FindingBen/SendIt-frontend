import React from "react";
import SvgLoader from "../SvgLoader";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
const OverallStatistics = ({ totalValues }) => {
  return (
    <div className="flex w-full gap-4">
      <div className="flex flex-row items-center md:w-[230px] lg:w-[256px] h-[120px] 2xl:w-[352px] 2xl:h-[155px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
              className="text-white text-5xl 2xl:text-6xl font-normal absolute top-5"
            >
              {totalValues.total_sends ?? 0}
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}

          <p className="text-white text-normal lg:text-normal 2xl:text-2xl font-semibold text-justify absolute right-2 bottom-2">
            Total Sends
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="It calculates the total ammount of sent messages excluding archived."
          stroke="currentColor"
          class="size-6 2xl:size-8 text-white/50 absolute right-2 top-2 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
        <Tooltip id="my-tooltip" />
      </div>

      <div className="flex flex-row items-center md:w-[230px] lg:w-[256px] h-[120px] 2xl:w-[352px] 2xl:h-[155px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
              className="text-white text-5xl 2xl:text-6xl font-semibold absolute top-5"
            >
              {totalValues.total_views ?? 0}
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
          <p className="text-white text-normal 2xl:text-2xl font-semibold text-justify absolute right-2 bottom-2">
            Total Views
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="It calculates the total ammount of screen views for all messages."
          stroke="currentColor"
          class="size-6 text-white/50 absolute right-2 top-2 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
        <Tooltip id="my-tooltip" />
      </div>

      <div className="flex flex-row items-center md:w-[230px] lg:w-[256px] h-[120px] 2xl:w-[352px] 2xl:h-[155px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
              className="text-white text-5xl 2xl:text-6xl font-semibold absolute top-5 flex flex-row"
            >
              {totalValues.total_spend ?? 0}
              <p className="lg:text-xl font-light">dkk</p>
            </motion.div>
          ) : (
            <p className="text-white font-semibold lg:text-2xl ml-2">
              <SvgLoader width={"w-8"} height={"h-8"} />
            </p>
          )}
          <p className="text-white text-normal 2xl:text-2xl font-semibold text-justify absolute right-2 bottom-2">
            Total spend
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Total ammount of money spend on the platform."
          stroke="currentColor"
          class="size-6 2xl:size-8 text-white/50 absolute right-2 top-2 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
        <Tooltip id="my-tooltip" />
      </div>
    </div>
  );
};

export default OverallStatistics;
