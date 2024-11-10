import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../redux/reducers/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import { setArchiveState } from "../redux/reducers/archiveReducer";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";
import { createElements } from "../utils/helpers/createElements";
import OverallStatistics from "../components/Analytics/OverallStatistics";

import formatDate from "../utils/helpers/dateFunction";

import CompletedCampaigns from "../components/CompletedCampaignsView/CompletedCampaigns";
import SvgLoader from "../components/SvgLoader";
import {
  clearMessages,
  setMessages,
  setMessagesCount,
  setOperation,
} from "../redux/reducers/messageReducer";
import { cleanPackage } from "../redux/reducers/packageReducer";
import { setCampaigns } from "../redux/reducers/completedCampaignsReducer";
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
    currentArchivedState,
    currentCampaignsState,
  } = useRedux();

  let [notes, setNotes] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [messageCount, setMessageCount] = useState("");
  const [campaignStats, setCampaignStats] = useState([]);
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
  console.log(currentUser);
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
    getCampaignStats();
    refreshAnalytics();
    setInitialLoad(false);
  }, [loading, listUpdated, sortOrder]);

  useEffect(() => {
    if (totalValues?.archived_state) {
      console.log("HEREE");
      getNotes();
    }
  }, [totalValues]);

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

  const getCampaignStats = async () => {
    try {
      let response = await axiosInstance.get("sms/campaign-stats");
      console.log(response.data);
      if (response.status === 200) {
        dispatch(setCampaigns(response.data));
      }
    } catch (error) {}
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

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue ">
            <h3 class="2xl:text-3xl lg:text-2xl text-sm font-semibold text-left text-white mx-20">
              Overview
            </h3>

            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>

          <div className="flex flex-row mx-20">
            <div className="flex flex-col 2xl:w-[210%]">
              <OverallStatistics totalValues={totalValues} />

              {/* table content */}
              <div
                className={` bg-mainBlue border-gray-800 shadow-md border-2 rounded-2xl mt-4`}
              >
                <div className="flex flex-row relative border-b border-gray-800">
                  <div className="flex flex-col">
                    <p className="text-white font-semibold text-xl xl:text-2xl 2xl:text-3xl flex items-start my-3 mt-3 ml-5">
                      Your latest messages
                    </p>
                    <p className="text-white/60 text-normal my-3 mt-1 ml-5">
                      Your draft messages containing the content ready to be
                      sent out.
                    </p>
                  </div>
                  <button
                    onClick={handleSortButtonClick}
                    className="px-2 py-1 2xl:px-4 2xl:py-2 mr-5 text-white font-normal text-sm 2xl:text-lg cursor-pointer bg-purpleHaze rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 top-4"
                  >
                    Sort by date
                  </button>
                </div>
                <div class="flex flex-col">
                  <div class="grid grid-cols-5 gap-4 text-white/50 font-normal text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                    <div className="">NAME</div>
                    <div>CREATED AT</div>
                    <div>ANALYTICS</div>
                    <div>STATUS</div>
                    <div>ACTION</div>
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
              </div>
            </div>
            <div className="container">
              <CompletedCampaigns
                percentage={totalValues?.overall_rate}
                campaigns={currentCampaignsState}
              />
            </div>
            {/* <QuickAnalytics
              analyticsOpen={analyticsOpen}
              views={views}
              closeAnalyticsDrawer={closeAnalyticsDrawer}
              smsId={smsId}
            /> */}
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
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    className="px-3 py-2 bg-navBlue border-2 border-gray-800 hover:bg-purpleHaze ml-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 rounded-lg text-white mt-2"
                    data-mdb-ripple-color="dark"
                    key={page}
                    id="paginationBtn"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <br></br>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
