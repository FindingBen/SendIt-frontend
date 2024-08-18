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
  const [showReDraft, setShowReDraft] = useState(false);
  const [messageId, setMessageId] = useState();
  const [listUpdated, setListUpdated] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    getArchives();
  }, [listUpdated, isUpdated]);

  const itemsPerPage = 9;
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
      let response = await axiosInstance.get(`/api/notes/?archive=true`);
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

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
            <h3 class="xl:text-3xl lg:text-2xl text-xl font-semibold text-left text-white mx-20">
              Archives
            </h3>

            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-row relative mx-20">
              <p className="text-white font-semibold text-xl xl:text-2xl flex items-start my-3 mt-3">
                Archived messages
              </p>
              <button
                //onClick={handleSortButtonClick}
                className="px-3 py-2 text-white font-light text-sm rounded-lg cursor-pointer bg-navBlue border-2 border-gray-800 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 top-3"
              >
                Sort by date
              </button>
            </div>
            <div
              class={`bg-navBlue border-2 border-gray-800 rounded-2xl shadow-lg mx-20 ${
                openCont ? "w-[60%]" : ""
              }`}
            >
              <div class="grid grid-cols-5 gap-4 grid-headers border-b-2 p-2 border-gray-800 text-white/50 font-normal text-sm xl:text-md py-2 px-4 mb-2">
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
                    const rowClassName = isEvenRow
                      ? "border-b border-white/50"
                      : "";
                    return (
                      <motion.div
                        className={` text-white font-normal text-xs lg:text-sm`}
                        key={message.id}
                      >
                        <div
                          className={`grid grid-cols-5 gap-3 mb-2 py-2 px-4`}
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
                            <div className="border-gray-800 rounded-md border-2 mx-auto my-auto p-0.5 hover:bg-purpleHaze hover:fill-red-700 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
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
                            </div>
                          </div>
                        </div>
                        <DeleteMessageModal
                          messageId={messageId}
                          showModalDelete={show}
                          onClose={() => setShow(false)}
                          setUpdated={handleListUpdate}
                          listUpdated={listUpdated}
                        />
                        <ReDraftModal
                          messageId={messageId}
                          showReDraft={showReDraft}
                          onClose={() => setShowReDraft(false)}
                          setUpdated={handleListUpdate}
                          listUpdated={isUpdated}
                        />
                      </motion.div>
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
      </div>
    </section>
  );
};

export default Archives;
