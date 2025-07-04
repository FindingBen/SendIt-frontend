import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion-3d";
import Loader from "../components/LoaderSkeleton/Loader";
import CampaignCard from "../components/MessageCard/CampaignCard";
import Search from "../components/SearchComponent/Search";
import CreateListModal from "../features/modal/CreateListModal";

const WelcomePage = () => {
  const axiosInstance = useAxiosInstance();
  const [notifications, setNotifications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
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

  const handleModal = () => {
    setShow(true);
  };

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
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-16 bg-navBlue sticky top-0 z-10">
          <Link to={"/welcome"}>
            <img
              src={require("../assets/noBgLogo.png")}
              width={65}
              alt="logo"
              className="mt-2"
            />
          </Link>
          <h3 className="2xl:text-3xl lg:text-xl text-lg font-euclid font-normal text-left text-white mx-5">
            Sendperplane
          </h3>

          <Search />

          <SmsPill />
        </div>

        <div className="ml-44">
          <div className="flex flex-col gap-3 text-start mx-20">
            <span className="text-3xl text-gray-200 font-euclid">
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

          <div className="grid grid-cols-5 gap-4 mx-20 mt-2">
            <div className="col-span-5 h-[200px] flex flex-row items-start relative row-start-1 p-6 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 rounded-2xl gap-4 shadow-lg">
              {/* System Status */}
              <div className="bg-ngrokGray rounded-xl p-2 h-[150px]">
                <span className="font-euclid text-xl text-gray-100 mb-2 block text-start">
                  System status
                </span>
                <div className="flex flex-row items-center gap-6 mt-2">
                  {/* App status */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 font-euclid">App</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  </div>
                  {/* SMS Provider status */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 font-euclid">
                      SMS Provider
                    </span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  </div>
                  {/* Add more status checks as needed */}
                </div>
              </div>

              {/* Start Building Section */}
              <div className="flex flex-col bg-ngrokGray rounded-xl p-2 h-[150px] w-[220px]">
                <span className="font-euclid text-xl text-gray-100 mb-2 block text-start">
                  Start building
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  {/* Campaign Button */}
                  <Link
                    to={"/create_campaign"}
                    className="flex flex-col p-2 items-center justify-center w-full h-10 bg-ngrokBlue hover:bg-blue-500 text-white font-euclid rounded-lg shadow transition group"
                  >
                    <span className="text-sm font-semibold">+ Campaign</span>
                  </Link>
                  {/* Contact List Button */}
                  <button
                    className="flex flex-col items-center p-2 justify-center w-full h-10 bg-ngrokBlue hover:bg-blue-500 text-white font-euclid rounded-lg shadow transition group"
                    onClick={handleModal}
                  >
                    {/* Contact List Icon */}

                    <span className="text-sm font-semibold">
                      + Contact List
                    </span>
                  </button>
                </div>
              </div>

              {/* Credit Status Section */}
              {/* <div className="flex flex-col items-center justify-between bg-ngrokGray rounded-xl p-2 h-[150px]">
                <div>
                  <span className="font-euclid text-xl text-gray-100 block">
                    Credit status
                  </span>
                  <span className="text-gray-200 font-semibold text-lg">
                    {currentUser?.credits ?? 0} credits
                  </span>
                </div>
                <button
                  className="bg-green-600 hover:bg-green-500 text-white font-euclid px-4 py-2 rounded-lg shadow transition"
                 
                >
                  Top up
                </button>
              </div> */}
            </div>
            <div className="col-span-3 row-span-1 row-start-2">
              <div className="flex flex-col items-start gap-2 border-2 bg-mainBlue border-gray-800 rounded-2xl p-3 col-span-5 row-start-2 h-[300px]">
                <span className="text-gray-200 text-xl font-medium">
                  Top performing campaigns
                </span>
                {campaigns.length > 0 ? (
                  <>
                    <div class="grid grid-cols-5 w-full gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                      <div>Name</div>
                      <div>Engagement</div>

                      <div>Performance</div>
                      <div>Clicks</div>
                      <div>Audience</div>
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
            <div className="col-span-2 row-span-1 col-start-4 row-start-2">
              <div className="flex flex-col items-start gap-2 border-2 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 rounded-2xl p-3 col-span-3 h-[300px] overflow-y-auto">
                <span className="text-gray-200 text-xl font-medium">
                  Recent activity
                </span>
                {loading ? (
                  <div className="flex flex-col gap-2 w-full items-center">
                    <Loader loading_name={"Loading notifications..."} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full text-sm">
                    {notifications.map((notification, idx) => (
                      <div
                        key={idx}
                        className="flex bg-ngrokGray rounded-xl justify-between w-full items-center text-start text-gray-200/70 border-b-2 border-gray-800 p-2"
                      >
                        <span className="rounded-full bg-green-500">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
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
            </div>

            <div className="col-span-5 row-start-3">
              <div className="flex flex-col items-start gap-2 border-2 mb-5 bg-mainBlue border-gray-800 rounded-2xl p-3 col-span-5 row-start-2">
                <span className="text-gray-200 text-xl font-medium">
                  Recent campaigns
                </span>
                {campaigns.length > 0 ? (
                  <>
                    <div class="grid grid-cols-5 w-full gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                      <div>Name</div>
                      <div>Engagement</div>

                      <div>Performance</div>
                      <div>Clicks</div>
                      <div>Audience</div>
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
        <CreateListModal
          showModal={show}
          redirect={true}
          onClose={() => setShow(false)}
        ></CreateListModal>
      </div>
    </section>
  );
};

export default WelcomePage;
