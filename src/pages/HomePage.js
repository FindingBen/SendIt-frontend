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
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex flex-col">
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-16 bg-navBlue sticky top-0 z-10">
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
                <div
                  className={`bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 shadow-md border-2 rounded-lg`}
                >
                  <div className="flex flex-row relative border-b border-gray-800">
                    <div className="flex flex-col">
                      <p className="text-white font-normal font-euclid text-xl xl:text-xl 2xl:text-3xl flex items-start my-3 mt-3 ml-5">
                        Recently completed campaigns
                      </p>
                      <p className="text-white/60 text-sm font-euclid my-3 mt-1 ml-5">
                        Your recently completed campaigns. Campaign runs for 3
                        days, then it gets archived and goes to this table.
                      </p>
                    </div>
                    <button
                      //onClick={handleSortButtonClick}
                      className="px-2 py-1 2xl:px-4 2xl:py-2 mr-5 text-white font-normal text-sm 2xl:text-lg cursor-pointer bg-ngrokBlue rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 top-4"
                    >
                      Sort by date
                    </button>
                  </div>
                  <div class="flex flex-col">
                    <div class="grid grid-cols-4 lg:grid-cols-5 gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                      <div>Name</div>
                      <div>Engagement</div>
                      <div>Performance</div>
                      <div>Clicks</div>
                      <div>Audience</div>
                    </div>
                    {campaigns?.length > 0 && displayedItems ? (
                      <div>
                        {campaigns?.map((campaign, index) => {
                          const isLastItem = index === campaigns?.length - 1;
                          const evenRow = index % 2 === 0;
                          return (
                            <motion.div
                              key={campaign.id}
                              className={`grid grid-cols-5 gap-4 text-sm text-white/90 py-2 px-1 ${
                                isLastItem ? "rounded-b-lg" : ""
                              } hover:bg-[#1C1C3A] transition-colors ${
                                index % 2 === 0
                                  ? "bg-[#191936]"
                                  : "bg-transparent"
                              }`}
                            >
                              <CampaignCard campaign={campaign} />
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex-1 items-center p-10">
                        <p className="text-white/50 text-base font-poppins">
                          Your content will appear here once you create it..
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
