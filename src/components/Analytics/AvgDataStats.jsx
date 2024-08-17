import React from "react";
import { Tooltip } from "react-tooltip";

const TooltipContent = () => (
  <div>
    <p>Avg. Session calculates the average session that is created by users.</p>
    <p>
      Avg. Session duration is the length of the duration created by users. So
      how much time they spent on your content.
    </p>
    <p>
      Avg. Scrolled users represents the number of users who scrolled all the
      way down till the end of your content.
    </p>
  </div>
);

const AvgDataStats = ({ avgData }) => {
  return (
    <div className="flex flex-col w-[50%] p-4 gap-3 items-start bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-xl relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        data-tooltip-id="my-tooltip"
        stroke="currentColor"
        class="size-6 text-white/50 absolute right-2 top-2 cursor-pointer"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>
      <Tooltip id="my-tooltip">
        <TooltipContent />
      </Tooltip>
      <div className="items-justify">
        <p className="text-lg text-justify text-white font-semibold">
          {avgData?.average_engagement_rate}
        </p>
        <p className="text-white/50 font-light text-justify text-sm">
          Avg. Session
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-lg text-white  text-justify font-semibold">
          {avgData?.average_user_engagement} secs
        </p>
        <p className="text-white/50 items-start text-justifyfont-light text-sm">
          Avg. Session Duration
        </p>
      </div>
      <div className="items-start">
        <p className="text-lg text-white text-justify font-semibold">
          {avgData?.average_scrolled_users.toFixed(2)}
        </p>
        <div className="text-white/50 items-start text-sm">
          Avg. Scrolled users
        </div>
      </div>
    </div>
  );
};

export default AvgDataStats;
