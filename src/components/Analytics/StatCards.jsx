import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";
import { Tooltip } from "react-tooltip";
const StatCards = ({ views, sms }) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <div className="flex flex-col gap-2">
        <div className="p-2 flex flex-row items-center h-[125px] lg:w-[188px] xl:w-[240px] 2xl:h-[170px] 2xl:w-[313px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
                className="text-white absolute top-5 text-5xl 2xl:text-6xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
              >
                {views?.data?.sorted_total_data?.screen_views_total}
              </motion.div>
            ) : (
              <p className="ml-2">
                <SvgLoader width={"w-10"} height={"h-10"} />
              </p>
            )}
          </div>
          <p className="text-white text-normal 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
            Total views
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Total ammount of times users have seen your content"
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
        <div className="p-2 flex flex-row items-center h-[125px] lg:w-[188px] xl:w-[240px] 2xl:h-[170px] 2xl:w-[313px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
          {sms?.has_button ? (
            <div>
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
                    className="text-white absolute top-5 text-5xl 2xl:text-6xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
                  >
                    {sms?.click_button ?? 0}
                  </motion.div>
                ) : (
                  <p className="ml-2">
                    <SvgLoader width={"w-10"} height={"h-10"} />
                  </p>
                )}
              </div>
              <p className="text-white text-normal 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
                Total button clicks
              </p>
            </div>
          ) : (
            <></>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Number of clicks made by users clicking on your image, text or any other element."
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
      </div>

      <div className="flex flex-col">
        <div className="p-2 flex flex-row items-center h-[125px] lg:w-[188px] xl:w-[240px] 2xl:h-[170px] 2xl:w-[313px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
                className="text-white absolute top-5 text-5xl 2xl:text-6xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
              >
                {sms?.sms_sends ?? 0}
              </motion.div>
            ) : (
              <p className="ml-2">
                <SvgLoader width={"w-10"} height={"h-10"} />
              </p>
            )}
          </div>
          <p className="text-white text-normal 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
            Total sends
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Total number of sms you sent for this content."
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
        <div className="p-2 mt-2 flex flex-row items-center h-[125px] lg:w-[188px] xl:w-[240px] 2xl:h-[170px] 2xl:w-[313px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
                className="text-white absolute top-5 text-5xl 2xl:text-6xl font-semibold ml-2 duration-300 opacity-100 transition-opacity"
              >
                {sms?.click_number ?? 0}
              </motion.div>
            ) : (
              <p className="ml-2">
                <SvgLoader width={"w-10"} height={"h-10"} />
              </p>
            )}
          </div>
          <p className="text-white text-normal 2xl:text-lg font-semibold text-justify absolute right-2 bottom-2">
            Sms url clicks
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Total number of sms clicks that lead people to your landing page. The numbers can be from same person so they are not unique."
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
      </div>
    </div>
  );
};

export default StatCards;
