import React, { useEffect, useState } from "react";
import SvgLoader from "../SvgLoader";
import HalfPieChart from "../../utils/chart/HalfPieChart";
import AnalyticsBarProgress from "../Progress/AnalyticsBarProgress";
import { Link } from "react-router-dom";
import CampaignStatModal from "../../features/modal/CampaignStatModal";

const CompletedCampaigns = ({ percentage, total_values }) => {
  const [showStat, setShowStat] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  return (
    <div
      className={`relative justify-between md:flex flex-col gap-2 ml-11 hidden md:h-[548px] md:w-[350px] xl:h-[548px] xl:w-[410px] 2xl:h-[720px] 2xl:w-[510px] bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-2xl shadow-lg p-4`}
    >
      <div className="mb-3">
        <div className="flex flex-row mb-2">
          <div>
            <p className="text-white text-2xl text-start font-semibold">
              Account Analytics
            </p>
          </div>
          <div class="text-white flex flex-row gap-1 rounded-md hover:bg-cyan-600 smooth-hover cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 border-gray-500 border-2 p-1 lg:p-2 absolute right-5 top-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <p>Export</p>
          </div>
        </div>
        <div>
          <div className="flex flex-row gap-4 mt-4 rounded-lg">
            <div className="justify-center h-16 w-16 p-1 bg-mainBlue border-2 border-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-10 text-white mx-auto mt-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </div>
            <AnalyticsBarProgress
              total_values={total_values?.deliveribility}
              metric={"Sms Deliveribility"}
            />
          </div>
          <div className="flex flex-row mt-2 gap-4 rounded-lg">
            <div className="justify-center h-16 w-16 p-1 bg-mainBlue border-2 border-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-10 text-white mx-auto mt-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
                />
              </svg>
            </div>
            <AnalyticsBarProgress
              total_values={total_values?.clicks_rate}
              metric={"Click Rate"}
            />
          </div>
          <div className="flex flex-row gap-4 mt-2 w-full rounded-lg">
            <div className="justify-center h-16 w-16 p-1 bg-mainBlue border-2 border-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-10 text-white mx-auto mt-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <AnalyticsBarProgress total_values={20} metric={"Bounce Rate"} />
          </div>
        </div>
      </div>
      <div className="bg-mainBlue rounded-lg border-gray-800 border-2 mt-2">
        <p className="text-white/80 font-semibold">Overall performance</p>
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
