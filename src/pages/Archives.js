import React, { useState, useEffect } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { config } from "../constants/Constants";
import ArchivePreviewPanel from "../components/PreviewComponent/ArchivePreviewPanel";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import { Link } from "react-router-dom";
import ReDraftModal from "../features/modal/ReDraftModal";
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
  const [messageId, setMessageId] = useState();
  const [listUpdated, setListUpdated] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [sortOrder, setSortOrder] = useState("created_at");

  useEffect(() => {
    getArchives();
  }, [listUpdated, isUpdated, search_name, sortOrder]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(archives?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };
  console.log(archives);
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
    console.log(e.target.value);
    setSearchName(e.target?.value);
  };

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
            <h3 class="xl:text-2xl lg:text-xl text-lg font-normal text-left text-white mx-20">
              Archives
            </h3>

            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>
          <div className="w-full">
            <div
              class={`bg-mainBlue border-gray-800 shadow-md border-2 rounded-2xl mx-20 ${
                openCont ? "w-[60%]" : ""
              }`}
            >
              <div className="flex flex-row space-x-2 p-2 border-b border-gray-800">
                <button
                  onClick={handleSortByDate}
                  className="px-2 text-normal 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white hover:bg-cyan-500 font-normal duration-200 rounded-lg border-2 border-gray-800 bg-darkestGray"
                >
                  Sort by date
                </button>
                <div class="relative w-[20%]">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-gray-500 ml-2 dark:text-gray-400"
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
                  <input
                    type="search"
                    id="default-search"
                    class="block w-full p-1.5 ps-10 text-sm text-gray-900 border-2 rounded-lg focus:border-gray-700 bg-darkestGray border-gray-800 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Search by campaign name..."
                    value={search_name}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div class="grid grid-cols-5 gap-4 font-semibold grid-headers border-b-2 p-2 border-gray-800 text-white/50 text-sm xl:text-md py-2 px-4">
                <div>Name</div>
                <div>Archived</div>
                <div>View</div>
                <div>Success rate</div>
                <div>Action</div>
              </div>
              {archives?.length > 0 && displayedItems ? (
                <div>
                  {displayedItems?.map((message, index) => {
                    const isEvenRow = index % 2 === 0; // Check if the row is even

                    const isLastItem = index === displayedItems.length - 1;

                    return (
                      <div
                        key={message.id}
                        className={`${
                          messageId === message.id
                            ? "bg-gray-700 text-white font-normal transition duration-300"
                            : isEvenRow
                            ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue text-white"
                            : "bg-mainBlue text-white"
                        } ${
                          isLastItem ? "rounded-b-2xl border-none" : ""
                        } font-light`}
                      >
                        <div
                          className={`grid grid-cols-5 font-normal 2xl:text-lg gap-4 p-2 border-b-2 border-gray-800 ${
                            isLastItem
                              ? "rounded-b-2xl 2xl:text-lg border-none"
                              : ""
                          }`}
                        >
                          <p>{message.message_name}</p>
                          <div>{message.created_at}</div>
                          <div
                            className="cursor-pointer hover:text-slate-500"
                            onClick={() => prepareMessageContent(message.id)}
                          >
                            View content
                          </div>
                          <div>{message.total_overall_progress} %</div>
                          <div className="flex flex-row mx-12">
                            <div className="border-gray-800 rounded-md border-2 mx-auto my-auto p-0.5 hover:bg-purpleHaze hover:fill-red-700 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
                              <Link
                                type="button"
                                className=""
                                onClick={() => deleteMessage(message.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  strokeWidth="0.5"
                                  stroke="currentColor"
                                  className="lg:w-5 lg:h-5 w-4 h-4 hover:fill-red-700"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </Link>
                            </div>
                            {/* <div className="border-gray-800 rounded-md border-2 mx-auto my-auto p-0.5 hover:bg-purpleHaze hover:fill-red-700 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
                              <Link
                                type="button"
                                className=""
                                onClick={() => reDraftMessage(message.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="lg:w-5 lg:h-5 w-4 h-4 hover:fill-gray-300"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m9 9 6-6m0 0 6 6m-6-6v12a6 6 0 0 1-12 0v-3"
                                  />
                                </svg>
                              </Link>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 items-center p-10">
                  <p className="text-white/50 text-base font-poppins">
                    Your content will appear here once you archive it..
                  </p>
                </div>
              )}
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
                    className="px-3 py-2 bg-navBlue border-2 border-gray-800 hover:bg-purpleHaze ml-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 rounded-lg text-white mt-2"
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
            {openCont ? (
              <div
                className={`absolute top-[15%] xl:top-[13%] right-20 h-[548px] w-[340px] xl:h-[548px] xl:w-[360px] bg-navBlue border-2 border-gray-800 rounded-2xl shadow-lg transition-transform transform`}
              >
                <div className="flex flex-col p-4 relative items-center">
                  <button
                    className="bg-darkBlue hover:bg-gray-700 duration-300 text-white px-2 rounded-full absolute right-3 top-3"
                    onClick={() => setOpenCont(false)}
                  >
                    X
                  </button>
                  <p className="text-white text-xl mb-2">Quick view</p>

                  <div className="flex flex-col items-center p-4 w-full h-[150px] rounded-lg">
                    <div className="flex flex-row relative">
                      <div className="p-2 flex items-center flex-col rounded-md mx-1 my-auto">
                        <ArchivePreviewPanel elements={elements} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <DeleteMessageModal
          messageId={messageId}
          showModalDelete={show}
          onClose={() => setShow(false)}
          setUpdated={handleListUpdate}
          listUpdated={listUpdated}
        />
        {/* <ReDraftModal
          messageId={messageId}
          showReDraft={showReDraft}
          onClose={() => setShowReDraft(false)}
          setUpdated={handleListUpdate}
          listUpdated={isUpdated}
        /> */}
      </div>
    </section>
  );
};

export default Archives;
