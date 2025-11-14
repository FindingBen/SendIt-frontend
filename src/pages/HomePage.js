import React, { useState, useEffect } from "react";
import { logOut } from "../redux/reducers/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";

import OverallStatistics from "../components/Analytics/OverallStatistics";

import SmsActivityChart from "../utils/chart/SmsActivityChart";
import { MessageCard } from "../components/MessageCard/MessageCard";

import { clearMessages } from "../redux/reducers/messageReducer";
import { cleanPackage } from "../redux/reducers/packageReducer";
import Search from "../components/SearchComponent/Search";
import SmsPill from "../components/SmsPill/SmsPill";
import CampaignCard from "../components/MessageCard/CampaignCard";

const HomePage = () => {
  const axiosInstance = useAxiosInstance();
  const { dispatch, currentUser } = useRedux();

  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCampaigns, setActiveCampaigns] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [totalValues, setTotalValues] = useState();

  //Date Section
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  useEffect(() => {
    // Fetch data only on initial load and when user is logged in
    getNotes();
    //getCampaignStats();
    getCampaigns();

    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (totalValues?.archived_state) {
      getNotes();
    }
  }, [totalValues]);

  useEffect(() => {
    refreshAnalytics();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(activeCampaigns?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = activeCampaigns?.slice(startIndex, endIndex);

  let getNotes = async () => {
    try {
      let response = await axiosInstance.get(`/api/active_campaigns/`);

      if (response.status === 200) {
        setActiveCampaigns(response.data.messages);
        setInitialLoad(false);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut());
        setInitialLoad(false);
      }
    } catch (error) {
      console.error(error);
      setInitialLoad(false);
    }
  };

  let refreshAnalytics = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/get_total_analytic_values/${currentUser}`
      );
      if (response.status === 200) {
        setTotalValues(response?.data);
        setInitialLoad(false);
      }
    } catch (error) {
      dispatch(cleanPackage());
      dispatch(clearMessages());
      dispatch(logOut());
      setInitialLoad(false);
    }
  };

  let getCampaigns = async () => {
    try {
      let response = await axiosInstance.get("sms/campaign-stats/?limit=true");
      if (response.status === 200) {
        setCampaigns(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="min-h-screen w-full items-center justify-center bg-[#0A0E1A]">
  
         <div className="flex flex-row mb-5 items-center h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-20 border-b border-[#1C2437]/40 px-8">
    <Search />
    <SmsPill />
  </div>

        <div className="mx-20">
          <div className="flex flex-col ml-44">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-5">
                {" "}
                <OverallStatistics
                  totalValues={totalValues}
                  loaded={initialLoad}
                />
              </div>
              <div className="col-span-3 row-span-2 row-start-2">
                <div className="flex flex-col items-start gap-2 bg-ngrokGray rounded-lg p-3 col-span-5 row-start-2 h-full">
                  <span className="text-gray-200 text-xl font-medium">
                    Active campaigns
                  </span>

                  <div class="grid grid-cols-4 w-full gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-700">
                    <div>Name</div>
                    <div>Created at</div>

                    <div>Analytics</div>
                    <div>Status</div>
                  </div>

                  {activeCampaigns?.length > 0 && displayedItems ? (
                    <div className="w-full">
                      {displayedItems?.map((message, index) => {
                        const isLastItem = index === displayedItems?.length - 1;
                        const evenRow = index % 2 === 0;
                        return (
                          <motion.div
                            className={`text-white font-normal text-xs lg:text-sm cursor-pointer border-b-2 border-gray-700`}
                            key={message.id}
                          >
                            <MessageCard
                              message={message}
                              activeCampaigns={true}
                              //archiveMsg={msgArchive}
                              //toggleAnalyticsDrawer={toggleAnalyticsDrawer}
                              //deleteMessage={deleteMessage}
                              // duplicateMessage={duplicateMessage({
                              //   messageId: message.id,
                              //   axiosInstance,
                              //   currentUser,
                              //   BASE_URL,
                              //   currentMessages,
                              //   setShowCopy,
                              //   setLoading,
                              //   setMessages,
                              //   dispatch,
                              // })}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-8 text-gray-300"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                        />
                      </svg>
                      <span className="text-lg text-gray-300">
                        No campaigns yet
                      </span>
                    </div>
                  )}
                  {totalPages > 1 && (
                    <motion.div
                      initial={
                        initialLoad
                          ? { opacity: 0, scale: 0.5 }
                          : { opacity: 1, scale: 1 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.8,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="bottom-0 mb-2 mx-auto"
                    >
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          type="button"
                          className="px-2 py-1 mt-1 border-2 border-gray-700 hover:bg-ngrokBlue ml-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 rounded-lg text-white"
                          data-mdb-ripple-color="dark"
                          key={page}
                          id="paginationBtn"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <br></br>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="col-span-2 row-span-2 col-start-4 row-start-2">
                <SmsActivityChart analytics_values={totalValues} />
              </div>
              <div className="col-span-5 row-span-2 row-start-4 mb-5">
  <div className="bg-gradient-to-b from-[#3E6FF4]/10 to-[#4937BA]/10 border-2 border-[#232634] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
    {/* Header */}
    <div className="flex justify-between items-start border-b border-[#232634] p-5 relative">
      <div className="flex flex-col">
        <h3 className="text-xl xl:text-2xl font-euclid text-start font-semibold text-white mb-1">
          Recently completed campaigns
        </h3>
        <p className="text-white/60 text-sm xl:text-base font-euclid">
          Your recently completed campaigns. Campaigns run for 3 days, then get archived and appear here.
        </p>
      </div>
      <button
        className="absolute right-5 top-5 px-3 py-2 2xl:px-4 2xl:py-2 bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] text-white font-normal text-sm 2xl:text-lg rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:-translate-y-1 hover:scale-105"
      >
        Sort by date
      </button>
    </div>

    {/* Table Header */}
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b border-[#232634] p-3">
      <div>Name</div>
      <div>Engagement</div>
      <div>Performance</div>
      <div>Clicks</div>
      <div className="hidden lg:block">Audience</div>
    </div>

    {/* Table Rows */}
    {campaigns?.length > 0 && displayedItems ? (
      <div className="flex flex-col divide-y divide-[#232634] max-h-[400px] overflow-y-auto">
        {campaigns.map((campaign, index) => {
          const isLastItem = index === campaigns.length - 1;
          return (
            <motion.div
              key={campaign.id}
              className={`grid grid-cols-5 lg:grid-cols-5 gap-4 p-3 text-white/90 text-sm cursor-pointer rounded-md hover:bg-[#1C1C3A] transition-colors ${
                index % 2 === 0 ? "bg-[#191936]" : "bg-transparent"
              } ${isLastItem ? "rounded-b-2xl" : ""}`}
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          );
        })}
      </div>
    ) : (
      <div className="flex items-center justify-center p-10">
        <p className="text-white/50 text-base font-poppins text-center">
          Your content will appear here once you create it.
        </p>
      </div>
    )}
  </div>
</div>

            </div>
          </div>
        </div>
     
    </section>
  );
};

export default HomePage;
