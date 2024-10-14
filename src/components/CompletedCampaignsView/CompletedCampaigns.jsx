import React, { useEffect, useState } from "react";
import SvgLoader from "../SvgLoader";
import HalfPieChart from "../../utils/chart/HalfPieChart";
import PerformanceBar from "../Progress/PerformanceBar";
import { Link } from "react-router-dom";
import CampaignStatModal from "../../features/modal/CampaignStatModal";

const CompletedCampaigns = ({ percentage, campaigns }) => {
  const [showStat, setShowStat] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleModal = (e) => {
    setShowStat(true);
  };

  const handleCampaignClick = (campaign) => {
    setShowStat(true);
    setSelectedCampaign(campaign);
  };

  return (
    <div
      className={`relative justify-between md:flex flex-col gap-2 ml-11 hidden md:h-[548px] md:w-[350px] xl:h-[548px] xl:w-[410px] 2xl:h-[720px] 2xl:w-[510px] bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-2xl shadow-lg p-4`}
    >
      <div className="mb-3">
        <div className="flex flex-row">
          <div>
            <p className="text-white text-2xl text-start font-semibold">
              Completed Campaigns
            </p>
            <p className="text-white/70 text-start mt-1">
              Your last 3 completed campaigns and account performance
            </p>
          </div>
          <Link
            to={"/campaign_stats/"}
            className="px-2 py-1 h-10 cursor-pointer bg-purpleHaze rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </Link>
        </div>

        {campaigns && campaigns.length > 0 ? (
          campaigns.map((campaign, index) => (
            <div
              key={index}
              onClick={() => handleCampaignClick(campaign)}
              className="grid grid-cols-3 text-normal 2xl:text-lg py-2 2xl:py-3 border-l-4 hover:bg-purple-950 cursor-pointer transition-all duration-150 border-l-purpleHaze text-white/80 mt-3 bg-mainBlue rounded-r-xl"
            >
              <div>{campaign.name}</div>
              <div className="flex flex-row items-center gap-1 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
                {campaign.audience}
              </div>
              <div className="flex flex-row items-center gap-1 mx-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>

                <div className="w-full">
                  <PerformanceBar performance={campaign.overall_performance} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white/60 text-center mt-10 flex flex-col gap-2">
            <p>Your completed campaigns will appear here.</p>
            <Link
              to={"/create_note"}
              className="px-2 py-1 2xl:px-4 2xl:py-2 mr-5 text-white font-normal text-sm 2xl:text-lg cursor-pointer bg-purpleHaze rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105"
            >
              Create content
            </Link>
          </div>
        )}
      </div>
      <div className="bg-mainBlue rounded-r-xl border-purpleHaze border-l-4 mt-2">
        <p className="text-white/80 font-semibold">Overall progress</p>
        <div className="items-center justify-center overflow-hidden">
          <HalfPieChart percentage={percentage} />
        </div>
      </div>
      <CampaignStatModal
        onClose={() => setShowStat(false)}
        showModalCamp={showStat}
        campaignObject={selectedCampaign}
      />
    </div>
  );
};

export default CompletedCampaigns;
