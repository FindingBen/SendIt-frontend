import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion-3d";
import Loader from "../components/LoaderSkeleton/Loader";
import CampaignCard from "../components/MessageCard/CampaignCard";
import TopNav from "../components/TopHeader/TopNav";
const WelcomePage = () => {
  const axiosInstance = useAxiosInstance();
  const [notifications, setNotifications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 7;
  const totalPages = Math.ceil(campaigns?.length / rowsPerPage);
  const [searchValue, setSearchValue] = useState("");
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = campaigns?.slice(startIndex, endIndex);

  useEffect(() => {
    getCampaigns();
    getNotifications();
  }, []);

  let getNotifications = async () => {
    setLoading(true);
    try {
      let response = await axiosInstance.get("notifications/get_notifications");
      if (response.status === 200) {
        setLoading(false);
        setNotifications(response.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

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
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
          <Link to={"/welcome"}>
            <img
              src={require("../assets/noBgLogo.png")}
              width={65}
              alt="logo"
              className="mt-2"
            />
          </Link>
          <h3 className="2xl:text-3xl lg:text-2xl text-lg font-euclid font-normal text-left text-white mx-5">
            Sendperplane
          </h3>

          <div class="relative">
            {searchValue === "" && (
              <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            )}
            <input
              type="search"
              id="default-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-100 border border-gray-300 rounded-lg bg-ngrokGray"
              required
            />
          </div>

          <SmsPill />
        </div>

        <div className="mx-44">
          <div className="flex flex-col gap-3 text-start mx-20">
            <span className="text-4xl text-gray-200 font-euclid">
              Welcome to Sendperplane
            </span>
            <div className="flex flex-row gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              <span className="text-gray-400 text-start font-euclid">
                This is a welcome page where you can access features with quick
                links, your notifications, top performing campaigns and related
                articles we reccomend reading.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 grid-rows-2 gap-4 mt-3 mx-20 h-[100%]">
            <div className="flex flex-col items-start gap-2 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-2xl p-3">
              <span className="text-gray-200 text-2xl mb-3 font-medium">
                Quick links
              </span>
              <div className="flex flex-col gap-3 items-start text-gray-50 font-thin">
                <Link to="/create_campaign">Create content</Link>
                <Link to="/contact_lists">Create contact list</Link>
                <Link to={`/account_settings/${currentUser}`}>Settings</Link>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 border-2 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 rounded-2xl p-3 col-span-3">
              <span className="text-gray-200 text-2xl font-medium">
                Notifications
              </span>
              {loading ? (
                <Loader loading_name={"Loading notifications..."} />
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  {notifications.map((notification, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between w-full items-center text-start text-gray-200/70 border-b-2 border-gray-800 p-2"
                    >
                      <span>{notification?.message}</span>
                      <span className="ml-4 text-xs text-gray-400 whitespace-nowrap">
                        {notification?.created_at
                          ? new Date(notification.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-2 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-2xl p-3 col-start-5">
              <span className="text-gray-200 text-xl font-medium">
                Related Articles
              </span>
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
                  to="https://sendperplane.com/"
                  className="flex flex-row gap-1"
                >
                  <span>Sendperplane</span>
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
            <div className="flex flex-col items-start gap-2 border-2 mb-5 bg-mainBlue border-gray-800 rounded-2xl p-3 col-span-5 row-start-2">
              <span className="text-gray-200 text-2xl font-medium">
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
                  <span className="text-lg text-gray-300">
                    No campaigns yet
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
