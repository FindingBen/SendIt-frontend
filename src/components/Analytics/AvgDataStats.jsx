import React from "react";

const AvgDataStats = ({ avgData }) => {
  return (
    <div className="flex flex-col w-[50%] p-4 gap-3 items-start bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-xl">
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
