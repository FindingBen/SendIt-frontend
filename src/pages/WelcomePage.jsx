import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion-3d";
import CampaignCard from "../components/MessageCard/CampaignCard";
const WelcomePage = () => {
  const axiosInstance = useAxiosInstance();
  const [notifications, setNotifications] = useState([]);
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
  console.log(campaigns);
  const {
    currentPackageState,
    currentContactList,
    dispatch,
    currentUser,
    currentDomain,
    currentShopifyToken,
  } = useRedux();
  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
          <h3 className="2xl:text-3xl lg:text-2xl text-lg font-normal text-left text-white mx-20">
            Start page
          </h3>

          <div className="flex flex-row items-center mx-20">
            <SmsPill />
          </div>
        </div>
        <hr className="text-white/50"></hr>
        <div className="flex flex-col gap-3 text-start mt-3 mx-20">
          <span className="text-4xl text-gray-200">
            Welcome to Sendperplane
          </span>
        </div>

        <div className="grid grid-cols-5 grid-rows-2 gap-4 mt-3 mx-20 h-[100%]">
          <div className="flex flex-col items-start gap-2 bg-mainBlue border-2 border-gray-800 rounded-2xl p-3">
            <span className="text-gray-200 text-2xl mb-3 font-normal">
              Quick links
            </span>
            <div className="flex flex-col gap-3 items-start text-gray-50">
              <Link to="/create_campaign">Create content</Link>
              <Link to="/contact_lists">Create contact list</Link>
              <Link to={`/account_settings/${currentUser}`}>Settings</Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 border-2 bg-mainBlue border-gray-800 rounded-2xl p-3 col-span-3">
            <span className="text-gray-200 text-2xl">Notifications</span>
            <span className="text-gray-300">
              All important notifications will be shown here..
            </span>
          </div>
          <div className="flex flex-col items-start gap-2 bg-mainBlue border-2 border-gray-800 rounded-2xl p-3 col-start-5">
            <span className="text-gray-200 text-xl">Related Articles</span>
            <div className="flex flex-col gap-3 items-start text-gray-50 underline">
              <Link
                to={"https://www.shopify.com/blog/sms-marketing"}
                className="flex flex-row gap-1"
              >
                <span>Sms marketing</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </Link>
              <Link
                to="https://www.plivo.com/blog/sms-marketing-statistics/"
                className="flex flex-row gap-1"
              >
                <span>Sms statistics</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </Link>
              <Link
                to="https://nytlicensing.com/latest/marketing/most-effective-content-marketing-tactics/"
                className="flex flex-row gap-1"
              >
                <span>Showcase content</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 border-2 bg-mainBlue border-gray-800 rounded-2xl p-3 col-span-5 row-start-2">
            <span className="text-gray-200 text-2xl">
              Top performing campaigns
            </span>
            {campaigns.length > 0 ? (
              <>
                <div class="grid grid-cols-7 w-full gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                  <div>Name</div>
                  <div>Engagement</div>
                  <div>Clicks</div>
                  <div>Audience</div>
                  <div>Performance</div>
                  <div>Start date</div>
                  <div>End date</div>
                </div>

                {paginatedData?.map((campaign, index) => {
                  const isLastItem = index === paginatedData?.length - 1;
                  const evenRow = index % 2 === 0;
                  return (
                    <motion.div
                      className={` text-white w-[100%] font-normal text-xs lg:text-sm cursor-pointer border-b-2 border-gray-800 ${
                        evenRow
                          ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue"
                          : "bg-mainBlue"
                      } ${isLastItem ? "rounded-b-2xl" : ""}`}
                      key={campaign.id}
                    >
                      <CampaignCard campaign={campaign} />
                    </motion.div>
                  );
                })}
              </>
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
                <span className="text-lg text-gray-300">No campaigns yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
