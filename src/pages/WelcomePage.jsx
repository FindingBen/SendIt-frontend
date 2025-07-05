import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import { logOut } from "../redux/reducers/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion-3d";
import Loader from "../components/LoaderSkeleton/Loader";
import CampaignCard from "../components/MessageCard/CampaignCard";
import Search from "../components/SearchComponent/Search";
import { MessageCard } from "../components/MessageCard/MessageCard";
import CreateListModal from "../features/modal/CreateListModal";
import { duplicateMessage } from "../utils/helpers/duplicateMessage";
import { config } from "../constants/Constants";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import ModalComponent from "../components/ModalComponent";

import {
  clearMessages,
  setMessages,
  setMessagesCount,
  setOperation,
} from "../redux/reducers/messageReducer";

const WelcomePage = () => {
  const {
    currentPackageState,
    currentContactList,
    dispatch,
    currentUser,
    currentDomain,
    currentOperationState,
    currentMessages,
  } = useRedux();
  const axiosInstance = useAxiosInstance();
  const [notifications, setNotifications] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [listUpdated, setListUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [showCopy, setShowCopy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState();
  const BASE_URL = config.url.BASE_URL;
  //Pagination logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(currentMessages?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = currentMessages?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };

  useEffect(() => {
    getCampaigns();
    getNotifications();
  }, []);
  console.log("DDADA", currentMessages);
  useEffect(() => {
    // Fetch data only on initial load and when user is logged in
    if (!currentMessages?.length) {
      getNotes();
      //setSortOrder("created_at");
    } else if (currentOperationState) {
      getNotes();
      dispatch(setOperation(false));
    } else if (sortOrder) {
      getNotes();
    }
    //getCampaignStats();

    setInitialLoad(false);
  }, [loading, listUpdated, sortOrder]);

  const handleModal = () => {
    setShowDelete(true);
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

  let getNotes = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/notes/?sort_by=${sortOrder}`
      );

      if (response.status === 200) {
        dispatch(setMessages(response.data.messages));
        dispatch(setMessagesCount(response.data.messages_count));
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

  const msgArchive = async (msgId) => {
    const body = {
      status: "archived",
    };
    try {
      let response = await axiosInstance.put(
        `api/message_view_edit/${msgId}/`,
        body
      );
      console.log(response);
      if (response.status === 200 || 201) {
        console.log("Success");
        getNotes();
      }
    } catch (error) {}
  };

  const handleListUpdate = () => {
    setListUpdated(!listUpdated);
  };

  const handleSortButtonClick = () => {
    // Toggle the sorting order between ascending and descending
    const newSortOrder =
      sortOrder === "-created_at" ? "created_at" : "-created_at";
    setSortOrder(newSortOrder);
  };

  const deleteMessage = (id) => {
    setMessageId(id);
    setShowDelete(true);
  };
  const systemStatusData = [
    { label: "App", status: "online" },
    { label: "SMS Provider", status: "online" },
  ];

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
                All components are working.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mx-20 mt-4">
            <div className="col-span-5 flex flex-row items-start relative row-start-1 gap-4">
              <div className="bg-ngrokGray rounded-xl p-2 h-[150px]">
                <span className="font-euclid text-xl text-gray-100 mb-2 block text-start">
                  System status
                </span>
                <div className="flex flex-row items-center gap-6 mt-2">
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
                </div>
              </div>

              <div className="flex flex-col bg-ngrokGray rounded-xl p-2 h-[150px] w-[220px]">
                <span className="font-euclid text-xl text-gray-100 mb-2 block text-start">
                  Start building
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to={"/create_campaign"}
                    className="flex flex-col p-2 items-center justify-center w-full h-10 border-2 border-gray-600 hover:bg-gray-500 text-white font-euclid rounded-lg"
                  >
                    <span className="text-sm font-semibold">+ Campaign</span>
                  </Link>

                  <button
                    className="flex flex-col items-center p-2 justify-center w-full h-10 border-2 border-gray-600 hover:bg-gray-500 text-white font-euclid rounded-lg"
                    onClick={handleModal}
                  >
                    <span className="text-sm font-semibold">
                      + Contact List
                    </span>
                  </button>
                </div>
              </div>
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

                    {campaigns?.map((campaign, index) => {
                      const isLastItem = index === campaigns?.length - 1;
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
                        {notification?.notif_type === "success" ? (
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
                        ) : (
                          <span className="rounded-full bg-red-500 flex items-center justify-center w-6 h-6 mr-2">
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        )}
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

            <div className="col-span-5 row-start-3 mb-10">
              <div
                className={` bg-mainBlue border-gray-800 shadow-md border-2 rounded-2xl`}
              >
                <div className="flex flex-row relative border-b border-gray-800">
                  <div className="flex flex-col">
                    <p className="text-white font-normal font-euclid text-xl xl:text-xl 2xl:text-3xl flex items-start my-3 mt-3 ml-5">
                      Draft campaigns
                    </p>
                    <p className="text-white/60 text-sm font-euclid my-3 mt-1 ml-5">
                      Your draft campaigns containing the content ready to be
                      sent out. Once they are sent, you can find them in
                      Dashboard page.
                    </p>
                  </div>
                  <button
                    onClick={handleSortButtonClick}
                    className="px-2 py-1 2xl:px-4 2xl:py-2 mr-5 text-white font-normal text-sm 2xl:text-lg cursor-pointer bg-ngrokBlue rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 top-4"
                  >
                    Sort by date
                  </button>
                </div>
                <div class="flex flex-col">
                  <div class="grid grid-cols-4 lg:grid-cols-5 gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                    <div>Name</div>
                    <div className="md:hidden lg:block">Create at</div>
                    <div>Analytics</div>
                    <div>Status</div>
                    <div>Action</div>
                  </div>
                  {currentMessages?.length > 0 && displayedItems ? (
                    <div>
                      {displayedItems?.map((message, index) => {
                        const isLastItem = index === displayedItems?.length - 1;
                        const evenRow = index % 2 === 0;
                        return (
                          <motion.div
                            className={`text-white font-normal text-xs lg:text-sm cursor-pointer border-b-2 border-gray-800 ${
                              evenRow
                                ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue"
                                : "bg-mainBlue"
                            } ${isLastItem ? "rounded-b-2xl" : ""}`}
                            key={message.id}
                          >
                            <MessageCard
                              message={message}
                              archiveMsg={msgArchive}
                              //toggleAnalyticsDrawer={toggleAnalyticsDrawer}
                              deleteMessage={deleteMessage}
                              duplicateMessage={duplicateMessage({
                                messageId: message.id,
                                axiosInstance,
                                currentUser,
                                BASE_URL,
                                currentMessages,
                                setShowCopy,
                                setLoading,
                                setMessages,
                                dispatch,
                              })}
                            />
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

                <DeleteMessageModal
                  messageId={messageId}
                  showModalDelete={showDelete}
                  onClose={() => setShowDelete(false)}
                  setUpdated={handleListUpdate}
                  listUpdated={listUpdated}
                />
              </div>
            </div>
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
                className="bottom-0"
              >
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    className="px-3 py-2 mt-2 bg-navBlue border-2 border-gray-800 hover:bg-cyan-600 ml-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 rounded-lg text-white"
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
        <ModalComponent modalType={"copy"} showModal={showCopy} />
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
