import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";
import { Tooltip } from "react-tooltip";

const TooltipContentStat = () => (
  <div>
    <p>
      Button analytics - each button you created for your content will be
      tracked here.
    </p>
  </div>
);

const ButtonAnalytics = ({ sms }) => {
  return (
    <div className="p-2 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 w-[92%] 2xl:w-[95%] h-full flex-1 rounded-2xl relative">
      {sms?.has_button ? (
        <div className="grid grid-cols-2 grid-rows-2 mt-4">
          <div className="flex flex-col p-1 relative">
            {sms?.button_1_name ? (
              <div className="p-2 flex flex-row items-center h-[100px] 2xl:h-[140px] w-[180px] 2xl:w-[220px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
                <div className="flex items-start p-2">
                  {sms ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white absolute top-5 text-2xl 2xl:text-3xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
                    >
                      {sms?.button_1}
                    </motion.div>
                  ) : (
                    <p className="ml-2">
                      <SvgLoader width={"w-10"} height={"h-10"} />
                    </p>
                  )}
                </div>
                <p className="text-white text-normal 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
                  {sms?.button_1_name}
                </p>

                {/* <Tooltip id="my-tooltip" /> */}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col p-1 relative">
            {sms?.button_2_name ? (
              <div className="p-2 flex flex-row items-center h-[100px] 2xl:h-[140px] w-[180px] 2xl:w-[220px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
                <div className="flex items-start p-2">
                  {sms ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white absolute top-5 text-2xl 2xl:text-3xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
                    >
                      {sms?.button_2}
                    </motion.div>
                  ) : (
                    <p className="ml-2">
                      <SvgLoader width={"w-10"} height={"h-10"} />
                    </p>
                  )}
                </div>
                <p className="text-white text-normal 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
                  {sms?.button_2_name}
                </p>

                {/* <Tooltip id="my-tooltip" /> */}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col p-1 relative">
            {sms?.button_3_name ? (
              <div className="p-2 flex flex-row items-center h-[100px] 2xl:h-[140px] w-[180px] 2xl:w-[220px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
                <div className="flex items-start p-2">
                  {sms ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white absolute top-5 text-2xl 2xl:text-3xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
                    >
                      {sms?.button_3}
                    </motion.div>
                  ) : (
                    <p className="ml-2">
                      <SvgLoader width={"w-6"} height={"h-6"} />
                    </p>
                  )}
                </div>
                <p className="text-white text-sm 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
                  {sms?.button_3_name}
                </p>

                {/* <Tooltip id="my-tooltip" /> */}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col p-1 relative">
            {sms?.button_4_name != null ? (
              <div className="p-2 flex flex-row items-center h-[100px] 2xl:h-[140px] w-[180px] 2xl:w-[220px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
                <div className="flex items-start p-2">
                  {sms ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white absolute top-5 text-2xl 2xl:text-3xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
                    >
                      {sms?.button_4}
                    </motion.div>
                  ) : (
                    <p className="ml-2">
                      <SvgLoader width={"w-6"} height={"h-6"} />
                    </p>
                  )}
                </div>
                <p className="text-white text-sm 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
                  {sms?.button_4_name}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mx-auto mt-5">
          <p className="text-white/50 text-2xl font-light">
            No button elements for this content
          </p>
        </div>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Total individual ammounts for each button related to this content."
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
  );
};

export default ButtonAnalytics;
