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
import RecentActivityModal from "../features/modal/RecentActivityModal";
import ShopifyIntegrationStatus from "../components/IntegrationSteps/ShopifyIntegrationStatus";

import {
  clearMessages,
  setMessages,
  setMessagesCount,
  setOperation,
} from "../redux/reducers/messageReducer";
import CancelScheduleModal from "../features/modal/CancelScheduleModal";

const WelcomePage = () => {
  const {
    currentUserState,
    dispatch,
    currentUser,
    currentOperationState,
    currentMessages,
  } = useRedux();
  const axiosInstance = useAxiosInstance();
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [scheduledCampaigns, setScheduledCampaigns] = useState([]);
  const [draft, setDrafts] = useState([]);
  const [listUpdated, setListUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageScheduled, setCurrentPageScheduled] = useState(1);
  const [show, setShow] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [sortOrder, setSortOrder] = useState("created_at");
  const [showCopy, setShowCopy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [messageId, setMessageId] = useState();
  const BASE_URL = config.url.BASE_URL;
  //Pagination logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(draft?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = draft?.slice(startIndex, endIndex);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const scheduledCampaignsVariable = true;
  const scheduledPerPage = 2;
  const totalScheduledPages = Math.ceil(
    scheduledCampaigns?.length / scheduledPerPage
  );
  const startIndexScheduled = (currentPageScheduled - 1) * scheduledPerPage;
  const endIndexScheduled = startIndexScheduled + scheduledPerPage;
  const displayedItemsScheduled = scheduledCampaigns?.slice(
    startIndexScheduled,
    endIndexScheduled
  );
  console.log(currentUserState)
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };

  const handlePageChangeScheduled = (page) => {
    setCurrentPageScheduled(page);
    setInitialLoad(false);
  };

  useEffect(() => {
    getCampaigns();
    getNotifications();
    getScheduledCampaigns();
  }, []);

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

  const handleModalCancel = (message_id) => {
    setSelectedMessageId(message_id);
    setShowCancel(true);
  };

  const handleModalActivity = (notification) => {
    setShowActivity(true);
    setNotification(notification);
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
      let response = await axiosInstance.get(
        "sms/campaign-stats/?best_perf=true"
      );
      if (response.status === 200) {
        setCampaigns(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let getScheduledCampaigns = async () => {
    try {
      let response = await axiosInstance.get(`/api/scheduled_campaigns/`);

      if (response.status === 200) {
        dispatch(setMessages(response.data.messages));
        // dispatch(setMessagesCount(response.data.messages_count));
        setScheduledCampaigns(response.data.messages);
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

  let getNotes = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/notes/?sort_by=${sortOrder}`
      );

      if (response.status === 200) {
        setDrafts(response.data.messages);
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

      if (response.status === 200 || 201) {
        console.log("Success");
        getNotes();
      }
    } catch (error) {}
  };

  const handleListUpdate = () => {
    setListUpdated(!listUpdated);
  };


  const formatNumberWithSeparators = (num) => {
  if (num === undefined || num === null) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const smsCount = 0;
const connectedStoresCount = 0;

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

  return (
    <section className="min-h-screen w-full bg-[#0A0E1A] text-white">
  {/* Top bar */}
  <div className="flex items-center mb-6 h-16 sticky top-0 z-20 bg-[#111827]/60 backdrop-blur-sm border-b border-[#111827]/40 px-6">
    <Search />
    <div className="ml-auto flex items-center gap-4">
      <SmsPill />
    </div>
  </div>

  <div className="flex flex-col px-8 ml-44">
    {/* Welcome + hint */}
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-euclid text-gray-100 text-start">Welcome to Sendperplane</h1>
        <div className="flex items-center gap-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <span>All components are working.</span>
        </div>
      </div>
    </div>

    {/* Grid layout */}
    <div className="max-w-6xl mx-auto w-full grid grid-cols-16 gap-6 mt-6">
      {/* Left column (status + quick actions + campaigns) */}
      <div className="col-span-16 lg:col-span-8 flex flex-col gap-6">
        {/* Top row: status + quick actions */}
        <div className="grid grid-cols-3 gap-4">
          <ShopifyIntegrationStatus hasImportedCustomers={currentUserState.shopify_connect}
          hasImportedProducts={currentUserState.product_import}/>

          <div className="bg-[#0F1724] rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-medium text-gray-100">Start building</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/create_campaign" className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#3e6ff4] to-[#4937BA] text-white font-medium hover:opacity-95">
                + Campaign
              </Link>
              <Link to="/contact_lists" className="block w-full text-center px-4 py-2 rounded-lg border-2 border-gray-800 bg-[#131826] text-gray-200 hover:bg-[#172033]">
                + Contact List
              </Link>
            </div>
          </div>

          <div className="bg-[#1B2233] rounded-2xl p-4 shadow-sm xl:w-full">
          <h3 className="text-lg font-medium">Recent activity</h3>

          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader loading_name={"Loading notifications..."} />
              </div>
            ) : notifications?.length ? (
              notifications.map((notification, idx) => (
                <div
                  key={idx}
                  onClick={() => handleModalActivity(notification)}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-[#111428] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        notification?.notif_type === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                  {notification?.notif_type === "success" ? (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-md text-gray-100 truncate">
                    {notification?.title}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {notification?.excerpt}
                  </div>
                </div>
              </div>

                    <div className="text-[10px] text-gray-500 whitespace-nowrap">
                      {notification?.created_at
                        ? new Date(notification.created_at).toLocaleString()
                        : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-gray-400 text-sm">No recent activity</div>
              )}
            </div>

                    </div>
        </div>

        {/* Top performing campaigns card */}
        <div className="bg-[#0F1724] rounded-2xl p-5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Top Performing Campaigns</h3>
            <div className="text-sm text-gray-400">{campaigns?.length ?? 0} campaigns</div>
          </div>

          {campaigns?.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-4 text-sm text-gray-300 font-medium mb-3 px-1">
                <div>Name</div>
                <div>Engagement</div>
                <div>Performance</div>
                <div>Clicks</div>
                <div>Audience</div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {campaigns.map((campaign, index) => (
                  <div key={campaign.id} className={`rounded-xl p-3 transition ${index % 2 === 0 ? "bg-[#0C1120]" : "bg-transparent"} hover:bg-[#111428]`}>
                    <CampaignCard campaign={campaign} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3" />
              </svg>
              <div className="text-lg">No campaigns yet</div>
            </div>
          )}
        </div>

        {/* Scheduled campaigns */}
        <div className="bg-[#0F1724] rounded-2xl p-3 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-medium text-start">Scheduled campaigns</h3>
              <p className="text-sm text-gray-400">Scheduled campaigns appear here — you can cancel or edit them.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSortButtonClick} className="px-3 py-1 rounded-md bg-[#131826] text-gray-200 border-2 border-gray-800 text-gray-200 hover:bg-[#172033]">Sort by date</button>
            </div>
          </div>

          <div className="space-y-2">
            {scheduledCampaigns?.length > 0 && displayedItemsScheduled ? (
              displayedItemsScheduled.map((message, index) => {
                const isLast = index === displayedItemsScheduled.length - 1;
                return (
                  <div key={message.id} className={`p-3 rounded-lg transition ${isLast ? "" : ""} ${index % 2 === 0 ? "bg-[#0C1120]" : "bg-transparent"} hover:bg-[#111428]`}>
                    <MessageCard
                      message={message}
                      archiveMsg={msgArchive}
                      sceduledCampaigns={true}
                      callmodal={() => handleModalCancel(message.id)}
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
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-gray-400">No scheduled campaigns.</div>
            )}
          </div>

          {/* scheduled pagination */}
          {totalScheduledPages > 1 && (
            <div className="mt-4 flex gap-2">
              {Array.from({ length: totalScheduledPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => handlePageChangeScheduled(p)} className={`px-3 py-1 rounded-md ${p === currentPageScheduled ? "bg-[#3e6ff4] text-white" : "bg-[#131826] text-gray-300"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#0F1724] rounded-2xl p-3 shadow-sm mb-10">
          <div className="flex items-start justify-between">
            <div className="text-start mb-2">
              <h3 className="text-lg font-medium">Draft campaigns</h3>
            <p className="text-sm text-gray-400">Draft campaigns that are ready for sending/scheduling will appear here.</p>
            </div>
            <button onClick={handleSortButtonClick} className="px-3 py-1 mb-2 rounded-lg bg-[#131826] text-gray-200 border-2 border-gray-800 hover:bg-[#172033]">Sort</button>
          </div>

          
            {draft?.length > 0 && displayedItems ? (
              displayedItems.map((message, i) => (
                <div key={message.id} className={`p-3 rounded-2xl ${i % 2 === 0 ? "bg-[#0C1120]" : "bg-transparent"} hover:bg-[#111428] border-2 border-gray-800 mb-2`}>
                  <MessageCard
                    message={message}
                    archiveMsg={msgArchive}
                    draftCampaigns={true}
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
                </div>
              ))
            ) : (
              <div className="py-6 text-gray-400">No drafts yet.</div>
            )}
          
        </div>
      </div>
    </div>

    {/* Modals (kept at bottom) */}
    <ModalComponent modalType={"copy"} showModal={showCopy} />
    <CreateListModal showModal={show} redirect={true} onClose={() => setShow(false)} />
    <RecentActivityModal showModal={showActivity} onClose={() => setShowActivity(false)} activity={notification} />
    <CancelScheduleModal showModal={showCancel} onClose={() => setShowCancel(false)} message_obj={selectedMessageId} />
    <DeleteMessageModal messageId={messageId} showModalDelete={showDelete} onClose={() => setShowDelete(false)} setUpdated={handleListUpdate} listUpdated={listUpdated} />
  </div>
</section>

  );
};

export default WelcomePage;
