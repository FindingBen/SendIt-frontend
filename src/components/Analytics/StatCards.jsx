import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import SvgLoader from "../SvgLoader";

const StatCards = ({ views, sms }) => {
  const cardClass =
    "flex-1 bg-[#23253a] relative rounded-md p-4 flex flex-col justify-center items-start";

  const valueClass =
    "text-[#3e6ff4] text-3xl 2xl:text-4xl font-semibold mb-1 ml-1";

  const labelClass =
    "text-white text-sm 2xl:text-base font-medium ml-1 mt-auto";

  return (
    <div className="flex flex-row gap-4 w-full">
      {/* Total Sends */}
      <div className={cardClass}>
        {views ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={valueClass}
          >
            {sms?.sms_sends ?? 0}
          </motion.div>
        ) : (
          <SvgLoader width={6} height={6} />
        )}
        <p className={labelClass}>Total sends</p>
        <InfoIcon
          tooltip="Total number of SMS you sent for this content."
          index={0}
        />
      </div>

      {/* Total Views */}
      <div className={cardClass}>
        {views ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={valueClass}
          >
            {views?.data?.sorted_total_data?.screen_views_total ?? 0}
          </motion.div>
        ) : (
          <SvgLoader width={6} height={6} />
        )}
        <p className={labelClass}>Total views</p>
        <InfoIcon
          tooltip="Total amount of times users have seen your content"
          index={1}
        />
      </div>

      {/* Click Button (if has_button) */}
      <div className={cardClass}>
        {sms?.has_button ? (
          views ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className={valueClass}
            >
              {sms?.click_button ?? 0}
            </motion.div>
          ) : (
            <SvgLoader width={6} height={6} />
          )
        ) : (
          <p className="text-white/70 font-medium ml-1">No Button</p>
        )}
        <p className={labelClass}>Total button clicks</p>
        <InfoIcon
          tooltip="Number of clicks made by users clicking on your image, text, or other element."
          index={2}
        />
      </div>

      {/* Sms URL Clicks */}
      <div className={cardClass}>
        {views ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={valueClass}
          >
            {sms?.click_number ?? 0}
          </motion.div>
        ) : (
          <SvgLoader width={6} height={6} />
        )}
        <p className={labelClass}>Sms url clicks</p>
        <InfoIcon
          tooltip="Total number of SMS clicks leading users to your landing page. These may include duplicates."
          index={3}
        />
      </div>

      <Tooltip id="tooltip-0" />
      <Tooltip id="tooltip-1" />
      <Tooltip id="tooltip-2" />
      <Tooltip id="tooltip-3" />
    </div>
  );
};

const InfoIcon = ({ tooltip, index }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    data-tooltip-id={`tooltip-${index}`}
    data-tooltip-content={tooltip}
    stroke="currentColor"
    className="size-5 text-white/40 absolute top-2 right-2 cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
    />
  </svg>
);

export default StatCards;
