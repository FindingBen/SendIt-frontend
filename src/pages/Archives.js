import React, { useState, useEffect } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import { useRedux } from "../constants/reduxImports";
import useAxiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { config } from "../constants/Constants";
import ArchivePreviewPanel from "../components/PreviewComponent/ArchivePreviewPanel";

const Archives = () => {
  const { currentUser } = useRedux();
  const axiosInstance = useAxiosInstance();
  const params = useParams();
  const BASE_URL = config.url.BASE_URL;
  const [archives, setArchives] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [elements, setElements] = useState([]);
  const [openCont, setOpenCont] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    getArchives();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(archives?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
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
      let response = await fetch(`${BASE_URL}/api/view/${id}/`);
      const data = await response.json();
      setElements(data.elements);
      setInitialLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  const prepareMessageContent = async (id) => {
    setOpenCont(true);
    getMessageContent(id);
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
                <div>NAME</div>
                <div>ARCHIVED</div>
                <div>SENT</div>
                <div>SUCCESS RATE</div>
                <div>ACTION</div>
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
                          <div></div>
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
            {openCont ? (
              <div
                className={`absolute top-[15%] xl:top-[11%] right-20 h-[548px] w-[340px] xl:h-[648px] xl:w-[430px] bg-navBlue border-2 border-gray-800 rounded-2xl shadow-lg transition-transform transform`}
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
