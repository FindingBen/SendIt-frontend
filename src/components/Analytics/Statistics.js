import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";
import ProgressBar from "../Progress/ProgressBar";
import { Tooltip } from "react-tooltip";

const TooltipContentStat = () => (
  <div>
    <p>
      Bounce rate - The percentage of visitors who leave a website after viewing
      only one page without interacting further.
    </p>
    <p>
      Engagement rate - The ratio of user interactions to the total audience,
      reflecting how actively users engage with content.
    </p>
    <p>
      Performance - The combination of all metrics you see on this dashboard,
      which have assigned metric at the end gives overall performance, you can
      read more about it in our manual soon.
    </p>
  </div>
);

const Statistics = ({ views }) => {
  return (
    <div className="p-4 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 w-[100%] h-full flex flex-col rounded-2xl relative">
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-col p-1 relative">
          <p className="text-white text-normal 2xl:text-lg font-semibold text-justify">
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
              className="text-white text-normal 2xl:text-lg font-semibold ml-2 absolute right-0"
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
          <p className="text-white text-normal 2xl:text-lg font-semibold text-justify">
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
              className="text-white text-normal 2xl:text-lg font-semibold ml-2 absolute right-0"
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
          <p className="text-white text-normal 2xl:text-lg font-semibold text-justify">
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
              className="text-white text-normal 2xl:text-lg font-semibold ml-2 absolute right-0"
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        data-tooltip-id="my-tooltip2"
        stroke="currentColor"
        class="size-6 text-white/50 absolute right-2 top-2 cursor-pointer"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>
      <Tooltip id="my-tooltip2">
        <TooltipContentStat />
      </Tooltip>
    </div>
  );
};

export default Statistics;
