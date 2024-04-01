import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { logOut } from "../redux/reducers/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";
import { createElements } from "../utils/helpers/createElements";
import OverallStatistics from "../components/Analytics/OverallStatistics";
import PieChart from "../utils/chart/PieChart";
import formatDate from "../utils/helpers/dateFunction";
import SvgLoader from "../components/SvgLoader";
import {
  clearMessages,
  setMessages,
  setMessagesCount,
  setOperation,
} from "../redux/reducers/messageReducer";
import { cleanPackage } from "../redux/reducers/packageReducer";
import SmsPill from "../components/SmsPill/SmsPill";

const HomePage = () => {
  const axiosInstance = useAxiosInstance();
  const {
    dispatch,
    currentUser,
    currentMessageCount,
    currentMessages,
    currentOperationState,
  } = useRedux();

  let [notes, setNotes] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [messageCount, setMessageCount] = useState("");
  const [totalValues, setTotalValues] = useState();
  const [listUpdated, setListUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const BASE_URL = config.url.BASE_URL;
  const [messageId, setMessageId] = useState();
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [smsId, setSmsId] = useState();
  const [views, setViews] = useState();
  const [sortOrder, setSortOrder] = useState("");
  //Date Section
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const formattedStartDate = formatDate(yesterday);
  const formattedEndDate = formatDate(today);

  useEffect(() => {
    // Fetch data only on initial load and when user is logged in
    if (!currentMessages.length) {
      getNotes();
    } else if (currentOperationState) {
      getNotes();
      dispatch(setOperation(false));
    } else if (sortOrder) {
      getNotes();
    }

    refreshAnalytics();
    setInitialLoad(false);
  }, [loading, listUpdated, sortOrder]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(currentMessages?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = currentMessages?.slice(startIndex, endIndex);

  let getNotes = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/notes/?sort_by=${sortOrder}`
      );

      if (response.status === 200) {
        setNotes(response?.data.messages);
        setMessageCount(response?.data.messages_count);
        dispatch(setMessages(response.data.messages));
        dispatch(setMessagesCount(response.data.messages_count));
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortButtonClick = () => {
    // Toggle the sorting order between ascending and descending
    const newSortOrder =
      sortOrder === "-created_at" ? "created_at" : "-created_at";
    setSortOrder(newSortOrder);
  };

  let refreshAnalytics = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/get_total_analytic_values/${currentUser}`
      );
      if (response.status === 200) {
        setTotalValues(response?.data);
      }
    } catch (error) {
      dispatch(cleanPackage());
      dispatch(clearMessages());
      dispatch(logOut());
    }
  };

  const getdataAnalytics = async (id) => {
    try {
      let response = await axiosInstance.get(
        `api/get_analytcs/${id}/?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      if (response.status === 200) {
        setViews(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = (id) => {
    setMessageId(id);
    setShow(true);
  };

  const handleListUpdate = () => {
    setListUpdated(!listUpdated);
  };

  const duplicateMessage = async (messageId) => {
    setShowCopy(true);
    try {
      setLoading(true);
      // Fetch details of the existing message
      const existingMessageResponse = await axiosInstance.get(
        `/api/view/${messageId}/`
      );

      if (existingMessageResponse.status !== 200) {
        console.error("Failed to fetch existing message details");
        return;
      }

      const existingMessage = existingMessageResponse.data.message;

      // Create a new message with the fetched details
      const duplicateMessageResponse = await axiosInstance.post(
        "/api/create_notes/",
        {
          users: currentUser,
          message_name: `${existingMessage.message_name}`,
        }
      );

      if (duplicateMessageResponse.status !== 200) {
        console.error("Failed to create a duplicate message");
        return;
      }

      const messageObject = duplicateMessageResponse.data.note.id;
      const elementContextList = existingMessageResponse.data.elements;
      const requestType = "copy";
      const createElementsData = createElements({
        elementContextList,
        messageObject,
        axiosInstance,
        BASE_URL,
        requestType,
      });

      await createElementsData();
      if (duplicateMessageResponse.status === 200) {
        const updatedMessageList = [
          ...currentMessages,
          duplicateMessageResponse.data.note,
        ];
        dispatch(setMessages(updatedMessageList));
      }
      setTimeout(() => setShowCopy(false), 1000);
      setLoading(false);
    } catch (error) {
      console.error("Error duplicating message:", error);
    }
  };

  const toggleAnalyticsDrawer = (id) => {
    setAnalyticsOpen(true);
    setSmsId(id);
    getdataAnalytics(id);
  };

  const closeAnalyticsDrawer = () => {
    setAnalyticsOpen(false);
    setSmsId();
  };

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-darkBlack">
            <h3 class="xl:text-3xl lg:text-2xl text-xl font-light text-left text-white mx-20">
              Overview
            </h3>

            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>

          <div className="mx-20">
            <OverallStatistics totalValues={totalValues} />
            {/* <SendingStats sms_stats={stats} /> */}

            {/* table content */}
            <div
              className={`transition-width ${
                analyticsOpen ? "w-[72%]" : "w-full"
              }`}
            >
              <div className="flex flex-row relative">
                <p className="text-white font-light lg:text-2xl text-xl flex items-start my-3 mt-3">
                  Your latest messages
                </p>
                <button
                  onClick={handleSortButtonClick}
                  className="px-3 py-2 text-white font-light text-sm rounded-2xl cursor-pointer bg-black transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 lg:top-5 top-5"
                >
                  Sort by date
                </button>
              </div>
              <div class="bg-black p-4 rounded-2xl shadow-lg">
                <div class="grid grid-cols-5 gap-4 grid-headers  text-white font-semibold text-sm xl:text-md py-2 px-4 rounded-2xl mb-2">
                  <div className="">Name</div>
                  <div>Created At</div>
                  <div>Analytics</div>
                  <div>Status</div>
                  <div>Action</div>
                </div>
                {currentMessages?.length > 0 && displayedItems ? (
                  <div>
                    {displayedItems?.map((message, index) => {
                      const isEvenRow = index % 2 === 0; // Check if the row is even
                      const rowClassName = isEvenRow
                        ? "border-b border-white/50"
                        : "";
                      return (
                        <motion.div
                          className={` text-white font-normal text-xs lg:text-sm`}
                        >
                          <div
                            className={`grid grid-cols-5 gap-3 mb-2 py-2 px-4`}
                          >
                            <p>{message.message_name}</p>
                            <div>{message.created_at}</div>
                            <div>
                              {message.status === "Draft" ? (
                                <p>Unavailabe</p>
                              ) : message.status === "Scheduled" ? (
                                <p>Unavailabe</p>
                              ) : (
                                <Link
                                  type="button"
                                  className="hover:bg-sky-300 rounded"
                                  onClick={() =>
                                    toggleAnalyticsDrawer(message.id)
                                  }
                                  //to={`/analytics/${message.id}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="lg:w-6 lg:h-6 w-4 h-4"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                                    />
                                  </svg>
                                </Link>
                              )}
                            </div>
                            <div>
                              {message.status === "Draft" ? (
                                <span class="text-xs font-medium leading-none text-center text-white bg-red-400 rounded-full px-3 lg:px-4 lg:py-1">
                                  Draft
                                </span>
                              ) : message.status === "Scheduled" ? (
                                <span class="text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse px-3 lg:px-4 lg:py-1">
                                  Scheduled
                                </span>
                              ) : (
                                <span class="text-xs font-medium leading-none text-center text-green-100 bg-green-400 rounded-full px-3 lg:px-4 lg:py-1">
                                  Sent
                                </span>
                              )}
                            </div>

                            <div className="flex flex-row items-center justify-center gap-1">
                              <Link
                                className="hover:bg-sky-300 rounded"
                                type="button"
                                to={`/edit_message/${message.id}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="0.6"
                                  stroke="currentColor"
                                  class="lg:w-6 lg:h-6 w-4 h-4 text-white"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </Link>

                              {message.status === "sent" ? (
                                <></>
                              ) : message.status === "Scheduled" ? (
                                <></>
                              ) : (
                                <Link
                                  className="hover:bg-sky-300 rounded"
                                  type="button"
                                  to={`/sms_editor/${message.id}`}

                                  // data-mdb-ripple-color="dark"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    strokeWidth="0.6"
                                    fill="currentColor"
                                    className="lg:w-6 lg:h-6 w-4 h-4"
                                  >
                                    <path
                                      d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </Link>
                              )}
                              <button
                                type="button"
                                className="hover:bg-sky-300 rounded"
                                onClick={() => duplicateMessage(message.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="0.6"
                                  stroke="currentColor"
                                  class="lg:w-6 lg:h-6 w-4 h-4"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="hover:bg-sky-300 rounded"
                                onClick={() => deleteMessage(message.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  strokeWidth="0.5"
                                  stroke="currentColor"
                                  className="lg:w-6 lg:h-6 w-4 h-4 fill-red-700"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
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
                showModalDelete={show}
                onClose={() => setShow(false)}
                setUpdated={handleListUpdate}
                listUpdated={listUpdated}
              />
              <ModalComponent modalType={"copy"} showModal={showCopy} />

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
                      className="px-3 py-2 bg-black ml-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 rounded-lg text-white mt-2"
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
            <div
              className={`absolute top-[15%] xl:top-[11%] -right-6 h-[548px] w-[340px] xl:h-[648px] xl:w-[430px] bg-black rounded-2xl shadow-lg transition-transform transform ${
                analyticsOpen
                  ? "xl:-translate-x-26 lg:-translate-x-24"
                  : "translate-x-full"
              }`}
            >
              <div className="flex flex-col p-4 relative items-center">
                <button
                  className="bg-darkBlue hover:bg-gray-700 duration-300 text-white px-2 rounded-full absolute right-3 top-3"
                  onClick={closeAnalyticsDrawer}
                >
                  X
                </button>
                <p className="text-white text-xl mb-2">Quick view</p>
                <PieChart
                  percentage={views?.data.overall_perf}
                  viewType={"ViewHome"}
                />
                <div className="flex flex-col items-center p-4 w-full h-[150px] rounded-lg">
                  <div className="flex flex-row relative">
                    <div className="p-2 flex items-center flex-col rounded-md mx-1 my-auto">
                      <p className="text-white text-normal font-light text-justify">
                        Campaign views
                      </p>
                      {views ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.1,
                            ease: [0, 0.41, 0.1, 1.01],
                          }}
                          className="text-white text-2xl font-normal shadow-lg"
                        >
                          {views?.data.sorted_total_data.screen_views_total}
                        </motion.div>
                      ) : (
                        <p className="text-white font-semibold text-2xl ml-2">
                          <SvgLoader width={"w-8"} height={"h-8"} />
                        </p>
                      )}
                    </div>
                    <div className="p-2 flex items-center flex-col rounded-md mx-1 my-auto">
                      <p className="text-white text-normal font-light text-justify">
                        Bounce rate
                      </p>
                      {views ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.1,
                            ease: [0, 0.41, 0.1, 1.01],
                          }}
                          className="text-white text-2xl font-normal shadow-lg"
                        >
                          {views?.data.sorted_total_data.bounceRate} %
                        </motion.div>
                      ) : (
                        <p className="text-white font-semibold text-2xl ml-2">
                          <SvgLoader width={"w-8"} height={"h-8"} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/analytics/${smsId}`}
                  className="bg-darkBlue hover:bg-gray-700 duration-300 px-2 py-1 mt-2 text-white rounded-lg"
                >
                  View more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
