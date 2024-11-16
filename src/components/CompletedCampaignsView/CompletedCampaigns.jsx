import React, { useEffect, useState } from "react";
import SvgLoader from "../SvgLoader";
import HalfPieChart from "../../utils/chart/HalfPieChart";
import PerformanceBar from "../Progress/PerformanceBar";
import { Link } from "react-router-dom";
import CampaignStatModal from "../../features/modal/CampaignStatModal";

const CompletedCampaigns = ({ percentage, total_values }) => {
  const [showStat, setShowStat] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleModal = (e) => {
    setShowStat(true);
  };

  const handleCampaignClick = (campaign) => {
    setShowStat(true);
    setSelectedCampaign(campaign);
  };
  const contactListsPercentages = 50;
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
            {/* <p className="text-white/70 text-start mt-1">
              Your last 3 completed campaigns and account performance
            </p> */}
          </div>
          {/* <Link
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
          </Link> */}
        </div>
        <div className="flex flex-row gap-4 mt-4 rounded-lg">
          <div className="justify-center h-16 w-16 p-1 bg-mainBlue border-2 border-gray-800 rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
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
          <div className="flex flex-col w-[70%]">
            <p className="text-white/80 text-lg text-start">
              Sms deliveribility
            </p>

            <div class="w-[100%] relative bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2">
              <div
                className={`bg-green-600 h-3 rounded-full dark:bg-green-500`}
                style={{ width: total_values?.deliveribility + "%" }}
              ></div>
              <p
                className={`absolute inset-0 bg-green-600 blur`}
                style={{ width: total_values?.deliveribility + "%" }}
              ></p>
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-2 gap-4 rounded-lg">
          <div className="cursor-pointer justify-center h-16 w-16 p-1 bg-mainBlue border-2 border-gray-800 rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
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
          <div className="flex flex-col w-[70%]">
            <p className="text-white/80 text-lg text-start">Click rate</p>

            <div class="w-[100%] relative bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2">
              <div
                className={`bg-green-600 h-3 rounded-full dark:bg-green-500`}
                style={{ width: total_values?.clicks_rate + "%" }}
              ></div>
              <p
                className={`absolute inset-0 bg-green-600 blur`}
                style={{ width: total_values?.clicks_rate + "%" }}
              ></p>
            </div>
          </div>
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
          <div className="flex flex-col w-[70%]">
            <p className="text-white/80 text-lg text-start">Bounce rate</p>

            <div class="w-[100%] relative bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2">
              <div
                className={`bg-green-600 h-3 rounded-full dark:bg-green-500`}
                style={{ width: contactListsPercentages + "%" }}
              ></div>
              <p
                className={`absolute inset-0 bg-green-600 blur`}
                style={{ width: contactListsPercentages + "%" }}
              ></p>
            </div>
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
