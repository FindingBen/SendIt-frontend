import React, { useState, useEffect } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { config } from "../constants/Constants";
import ArchivePreviewPanel from "../components/PreviewComponent/ArchivePreviewPanel";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import Search from "../components/SearchComponent/Search";
import { setArchiveState } from "../redux/reducers/archiveReducer";

const Archives = () => {
  const { currentUser, currentFormState, dispatch } = useRedux();
  const axiosInstance = useAxiosInstance();
  const params = useParams();
  const BASE_URL = config.url.BASE_URL;
  const [archives, setArchives] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [elements, setElements] = useState([]);
  const [openCont, setOpenCont] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [search_name, setSearchName] = useState("");
  const [showReDraft, setShowReDraft] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [messageId, setMessageId] = useState();
  const [listUpdated, setListUpdated] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [sortOrder, setSortOrder] = useState("created_at");

  useEffect(() => {
    getArchives();
  }, [listUpdated, isUpdated, search_name, sortOrder]);

  const itemsPerPage = 7;
  const totalPages = Math.ceil(archives?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };

  const deleteMessage = (id) => {
    setMessageId(id);
    setShow(true);
  };

  const reDraftMessage = (id) => {
    setMessageId(id);
    setShowReDraft(true);
    setIsUpdated();
    dispatch(setArchiveState({ archived: true }));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = archives?.slice(startIndex, endIndex);

  const getArchives = async () => {
    try {
      let url = "/api/view_archives/";
      const queryParts = [];
      if (sortOrder) queryParts.push(`sort_by=${sortOrder}`);
      if (search_name) queryParts.push(`search=${search_name}`);
      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
      }
      let response = await axiosInstance.get(url);
      if (response.status === 200) {
        setArchives(response?.data.messages);
      }
    } catch (error) {}
  };

  const getMessageContent = async (id) => {
    try {
      let response = await axiosInstance.get(`${BASE_URL}/api/view/${id}/`);
      // const data = await response.json();
      setElements(response.data.elements);
      setInitialLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  const prepareMessageContent = async (id) => {
    setOpenCont(true);
    getMessageContent(id);
  };

  const handleListUpdate = () => {
    setListUpdated(!listUpdated);
  };

  const handleSortByDate = () => {
    setSortOrder(sortOrder === "-created_at" ? "created_at" : "-created_at");
  };

  const handleSearchChange = (e) => {

    setSearchName(e.target?.value);
  };

  return (
    <section className="min-h-screen w-full items-center justify-center bg-[#0A0E1A]">
      <div className="flex flex-row items-center mb-6 h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-10 border-b border-[#1C2437]/40">
      <Search />
      <SmsPill />
    </div>
      <div className="flex-1 flex flex-col lg:flex-row ml-44">
  <div className="flex-1 sm:px-0">
    {/* Header */}
    <div className="flex justify-between items-center mb-6 h-20">
      <h3 className="xl:text-2xl lg:text-xl text-lg font-euclid text-left text-gray-100 mx-20">
        Archives
      </h3>
    </div>

    <div className="w-full">
      <div
        className={`mx-20 bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 ${
          openCont ? "w-[60%]" : ""
        }`}
      >
        {/* Controls */}
        <div className="flex flex-row items-center justify-between p-4 border-b border-[#1C2437]/40">
          <div className="flex flex-row gap-3">
            <button
              onClick={handleSortByDate}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-[#242E44] hover:bg-[#2E3B59] rounded-lg border border-[#1C2437]/40 transition-all duration-200"
            >
              Sort by date
            </button>

            {/* Search */}
            <div className="relative w-60">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search by campaign name..."
                value={search_name}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 text-sm bg-[#0D1320] border border-[#1C2437]/50 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#3E6FF4]/30 focus:border-[#3E6FF4]/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 font-semibold text-gray-400 text-sm xl:text-base border-b border-[#1C2437]/40 px-4 py-3">
          <div>Name</div>
          <div>Archived</div>
          <div>View</div>
          <div>Success rate</div>
          <div>Action</div>
        </div>

        {/* Table Content */}
        {archives?.length > 0 && displayedItems ? (
          <div className="divide-y divide-[#1C2437]/30">
            {displayedItems.map((message, index) => {
              const isEven = index % 2 === 0;
              const isActive = messageId === message.id;

              return (
                <div
                  key={message.id}
                  className={`grid grid-cols-5 items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#3E6FF4]/15 shadow-[0_0_12px_rgba(62,111,244,0.25)]"
                        : isEven
                        ? "bg-[#1F273A] hover:bg-[#242E44]"
                        : "bg-[#202B3E] hover:bg-[#283452]"
                    }
                  `}
                >
                  <p className="truncate text-gray-200 font-medium">
                    {message.message_name}
                  </p>
                  <div className="text-gray-400 text-sm">{message.created_at}</div>
                  <div
                    className="text-[#3E6FF4] hover:text-[#5C87FF] transition-colors duration-150 cursor-pointer"
                    onClick={() => prepareMessageContent(message.id)}
                  >
                    View content
                  </div>
                  <div className="text-gray-300 text-sm">
                    {message.total_overall_progress}%
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 rounded-lg bg-[#2A334D]/50 hover:bg-[#3E6FF4]/20 text-gray-400 hover:text-red-400 transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 00-3.478-.397m-12 .562a48.11 48.11 0 013.478-.397m7.5 0v-.916a2.2 2.2 0 00-2.09-2.2h-3.32a2.2 2.2 0 00-2.09 2.2v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            Your content will appear here once you archive it.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] text-white shadow-[0_0_12px_rgba(62,111,244,0.25)]"
                    : "bg-[#1B2233] hover:bg-[#242E44] text-gray-400"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}

      {/* Quick View Panel */}
      {openCont && (
        <div className="absolute top-[15%] right-20 w-[360px] h-[540px] bg-[#1B2233] border border-[#1C2437]/40 rounded-2xl shadow-[0_0_18px_rgba(0,0,0,0.35)] transition-all">
          <div className="flex flex-col p-4 relative items-center">
            <button
              className="absolute right-3 top-3 bg-[#242E44] hover:bg-[#3E6FF4]/20 text-gray-300 hover:text-white transition-all rounded-full px-2 py-1"
              onClick={() => setOpenCont(false)}
            >
              ×
            </button>
            <p className="text-lg font-medium text-gray-100 mb-4">
              Quick view
            </p>

            <div className="flex flex-col items-center p-4 w-full h-[150px] rounded-lg bg-[#0D1320]/40 border border-[#1C2437]/40">
              <ArchivePreviewPanel elements={elements} />
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      <DeleteMessageModal
        messageId={messageId}
        showModalDelete={show}
        onClose={() => setShow(false)}
        setUpdated={handleListUpdate}
        listUpdated={listUpdated}
      />
    </div>
  </div>
</div>

    </section>
  );
};

export default Archives;
