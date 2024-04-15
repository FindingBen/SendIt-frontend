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
import { MessageCard } from "../components/MessageCard/MessageCard";

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
      //setSortOrder("created_at");
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
  console.log(sortOrder);
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
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
            <h3 class="xl:text-3xl lg:text-2xl text-xl font-semibold text-left text-white mx-20">
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
              className={`transition-width bg-mainBlue border-gray-800 shadow-md border-2 rounded-2xl mt-4 ${
                analyticsOpen ? "w-[72%]" : "w-full"
              }`}
            >
              <div className="flex flex-row relative border-b border-gray-800">
                <p className="text-white font-semibold text-xl xl:text-2xl flex items-start my-3 mt-3 ml-5">
                  Your latest messages
                </p>
                <button
                  onClick={handleSortButtonClick}
                  className="px-2 py-1 mr-5 text-white font-normal text-sm cursor-pointer bg-purpleHaze rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 top-4"
                >
                  Sort by date
                </button>
              </div>
              <div class="flex flex-col">
                <div class="grid grid-cols-5 gap-4 text-white/50 font-normal text-sm border-b-2 p-2 border-gray-800">
                  <div className="">NAME</div>
                  <div>CREATED AT</div>
                  <div>ANALYTICS</div>
                  <div>STATUS</div>
                  <div>ACTION</div>
                </div>
                {currentMessages?.length > 0 && displayedItems ? (
                  <div>
                    {displayedItems?.map((message, index) => {
                      return (
                        <motion.div
                          className={`text-white font-normal text-xs lg:text-sm cursor-pointer border-b-2 border-gray-800 bg-mainBlue`}
                        >
                          <MessageCard
                            message={message}
                            toggleAnalyticsDrawer={toggleAnalyticsDrawer}
                            deleteMessage={deleteMessage}
                            duplicateMessage={duplicateMessage}
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
              className={`absolute top-[15%] xl:top-[11%] -right-6 h-[548px] w-[340px] xl:h-[648px] xl:w-[430px] bg-mainBlue border-2 border-gray-800 rounded-2xl shadow-lg transition-transform transform ${
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
                  className="bg-purpleHaze hover:bg-gray-700 duration-300 px-2 py-1 mt-2 text-white rounded-lg"
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
