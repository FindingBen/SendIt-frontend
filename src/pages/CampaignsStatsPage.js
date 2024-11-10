import React, { useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import PerformanceBar from "../components/Progress/PerformanceBar";
import "../css/ContactList.css";

const CampaignsStatsPage = () => {
  const axiosInstance = useAxiosInstance();
  const [sortOrder, setSortOrder] = useState("first_name");
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;
  const totalPages = Math.ceil(campaigns?.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = campaigns?.slice(startIndex, endIndex);

  useEffect(() => {
    getCampaigns();
  }, []);

  let getCampaigns = async () => {
    try {
      let response = await axiosInstance.get("sms/campaign-stats/?all=true");
      if (response.status === 200) {
        setCampaigns(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center h-20 bg-navBlue mx-20">
            <h3 class="text-lg lg:text-xl 2xl:text-2xl font-semibold text-left text-white">
              Completed Campaigns
            </h3>

            <div class="items-start w-32 h-10">
              <div className="inline-flex mx-auto mt-1 gap-2">
                <div class="text-white flex flex-row gap-1 rounded-md hover:bg-purpleHaze smooth-hover cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 border-gray-500 border-2 p-2">
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

                {/* <div class="text-white rounded-md hover:text-white/50 smooth-hover cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                    />
                  </svg>
                </div> */}
              </div>
            </div>
          </div>
          <p className="text-white/60 text-start text-sm xl:text-normal my-3 mx-20">
            Your completed campaigns and their individual performance. You can
            export the campaigns to analyze the data. If you wish to see your
            overall performance go to your <u>profile dashboard.</u>
          </p>

          <div className="mx-20">
            <div className="w-full mainContainer">
              <div class="items-center justify-center rounded-2xl mb-3 w-full bg-mainBlue border-gray-800 border-2 shadow-md">
                <div className="flex flex-row space-x-2 p-2">
                  <button
                    className={`px-2 py-1 text-xs lg:text-lg 2xl:text-xl text-white font-light hover:bg-slate-500 duration-200 rounded-lg bg-darkestGray ${
                      sortOrder === "first_name" ? "bg-purpleHaze" : ""
                    }`}
                    //onClick={handleSortByName}
                  >
                    Sort by Name
                  </button>
                  <button
                    className={`px-2 text-xs lg:text-lg 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white font-light hover:bg-slate-500 duration-200 rounded-lg bg-darkestGray ${
                      sortOrder === "created_at" ? "bg-purpleHaze" : ""
                    }`}
                    //onClick={handleSortByDateCreated}
                  >
                    Sort by Date Created
                  </button>
                </div>

                <div>
                  <div class="grid grid-cols-5 lg:grid-cols-7 text-xs lg:text-lg 2xl:text-xl gap-4 grid-headers text-white/50 font-normalborder-b-2 p-2 border-gray-800">
                    <div>Campaign Name</div>
                    <div className="hidden lg:block">Start Date</div>
                    <div className="hidden lg:block">End Date</div>
                    <div>Clicks</div>
                    <div>Views</div>
                    <div>Audience</div>
                    <div>Performance</div>
                  </div>
                  {paginatedData?.map((rowData, index) => {
                    const isLastItem = index === paginatedData.length - 1;
                    const evenRow = index % 2 === 0;
                    return (
                      <div
                        key={rowData.id}
                        className={`${
                          evenRow
                            ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue text-white"
                            : "bg-mainBlue text-white"
                        } ${
                          isLastItem ? "rounded-b-2xl border-none" : ""
                        } font-light`}
                      >
                        <div
                          className={`grid grid-cols-5 lg:grid-cols-7 text-xs lg:text-lg 2xl:text-xl gap-4 p-2 border-b-2 border-gray-800 ${
                            isLastItem
                              ? "rounded-b-2xl 2xl:text-lg border-none"
                              : ""
                          }`}
                        >
                          <div>{rowData.name}</div>
                          <div className="hidden lg:block">
                            {rowData.campaign_start}
                          </div>
                          <div className="hidden lg:block">
                            {rowData.campaign_end}
                          </div>
                          <div>{rowData.total_clicks}</div>
                          <div>{rowData.engagement}</div>
                          <div>{rowData.audience}</div>
                          <div className="flex flex-row gap-1">
                            {
                              <PerformanceBar
                                performance={rowData.overall_perfromance}
                              />
                            }
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignsStatsPage;
