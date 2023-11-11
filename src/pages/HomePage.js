import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/Home.css";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../utils/axiosInstance";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import { motion } from "framer-motion";

const HomePage = () => {
  const axiosInstance = useAxiosInstance();
  let [notes, setNotes] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [listUpdated, setListUpdated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [show, setShow] = useState(false);

  const [messageId, setMessageId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    getNotes();
    setListUpdated(false);
    setIsLoaded(true);
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(notes.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = notes.slice(startIndex, endIndex);

  let getNotes = async () => {
    try {
      let response = await axiosInstance.get("/api/notes/");

      if (response.status === 200) {
        setNotes(response?.data);
        setIsLoaded(false);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut(user, token));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = (id) => {
    setMessageId(id);
    setShow(true);
  };


  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center xl:mb-3">
            <h3 class="xl:text-3xl text-2xl font-extralight text-left text-white/50">
              Home dashboard
            </h3>

            <div class="inline-flex items-center space-x-2">
              <button>
                <Link
                  class="text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                  to={"/create_note"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </Link>
              </button>
            </div>
          </div>

          <div class="items-center justify-center rounded-lg mb-3 w-full">
            <div class="col-span-12">
              <div class="overflow-auto lg:overflow-visible">
                <div class="overflow-x-auto">
                  <div class="my-6">
                    <div class="grid grid-cols-5 gap-4 grid-headers bg-gray-600/50 text-white font-poppins text-sm xl:text-md py-2 px-4 rounded-full mb-2">
                      <div>Type</div>
                      <div>Created At</div>
                      <div>Analytics</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>
                    {notes?.length > 0 && displayedItems ? (
                      <div>
                        {displayedItems?.map((message, index) => (
                          <motion.div
                            initial={
                              initialLoad
                                ? { opacity: 0, scale: 0.5 }
                                : { opacity: 1, scale: 1 }
                            }
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2,
                              ease: [0, 0.41, 0.1, 1.01],
                            }}
                            class="bg-darkBlue rounded-full text-white text-sm xl:text-md"
                          >
                            <div className="mb-2">
                              <div
                                className={`grid grid-cols-5 gap-4 py-2 px-4`}
                              >
                                <p>Sms</p>
                                <div>{message.created_at}</div>
                                <div>
                                  {message.status == "Draft" ? (
                                    <p>Unavailabe</p>
                                  ) : message.status == "Scheduled" ? (
                                    <p>Unavailabe</p>
                                  ) : (
                                    <Link
                                      type="button"
                                      className="hover:bg-sky-300 rounded"
                                      to={`/analytics/${message.id}`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6"
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
                                    <span class="bg-red-400 text-gray-50 rounded-full px-2">
                                      Draft
                                    </span>
                                  ) : message.status === "Scheduled" ? (
                                    <span class="bg-blue-400 text-gray-700 rounded-full px-2">
                                      Scheduled
                                    </span>
                                  ) : (
                                    <span class="bg-green-400 text-gray-50 text-sm rounded-full px-2">
                                      Sent
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <Link
                                    className="hover:bg-sky-300 rounded"
                                    type="button"
                                    to={`/edit_message/${message.id}`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="w-6 h-6"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                      />
                                    </svg>
                                  </Link>

                                  {message.status === "sent" ? (
                                    <a
                                      className="hover:bg-sky-300 rounded disabled-link"
                                      type="button"
                                      to={`/sms_editor/${message.id}`}
                                      // data-mdb-ripple-color="dark"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        fill="currentColor"
                                        className="w-6 h-6 fill-gray-600"
                                      >
                                        <path
                                          d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </a>
                                  ) : message.status === "Scheduled" ? (
                                    <a
                                      className="hover:bg-sky-300 rounded disabled-link"
                                      type="button"
                                      to={`/sms_editor/${message.id}`}
                                      // data-mdb-ripple-color="dark"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        fill="currentColor"
                                        className="w-6 h-6 fill-gray-600"
                                      >
                                        <path
                                          d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </a>
                                  ) : (
                                    <Link
                                      className="hover:bg-sky-300 rounded mx-3"
                                      type="button"
                                      to={`/sms_editor/${message.id}`}

                                      // data-mdb-ripple-color="dark"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        fill="currentColor"
                                        className="w-6 h-6 fill-green-600"
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
                                    onClick={() => deleteMessage(message.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.0"
                                      stroke="currentColor"
                                      className="w-6 h-6 fill-red-500"
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
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 items-center p-10">
                        <p className="text-white/50 text-base font-poppins">
                          Your content will appear here once you create it..
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DeleteMessageModal
                messageId={messageId}
                showModalDelete={show}
                onClose={() => setShow(false)}
                listUpdated={listUpdated}
                setUpdated={() => setListUpdated(true)}
              />
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
                    className="btn btn-outline-secondary"
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
      </div>
    </section>
  );
};

export default HomePage;
