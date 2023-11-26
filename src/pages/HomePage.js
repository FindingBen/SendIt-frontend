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
import { createElements } from "../utils/helpers/createElements";
import { motion } from "framer-motion";
import { config } from "../constants/Constants";

const HomePage = () => {
  const axiosInstance = useAxiosInstance();
  let [notes, setNotes] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [messageCount, setMessageCount] = useState("");
  const [totalValues, setTotalValues] = useState();
  const [listUpdated, setListUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const BASE_URL = config.url.BASE_URL;
  const [messageId, setMessageId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    getNotes();
    setLoading(true);
  }, [listUpdated, loading]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(notes?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialLoad(false);
  };
  console.log(notes);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = notes.slice(startIndex, endIndex);

  let getNotes = async () => {
    try {
      let response = await axiosInstance.get("/api/notes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });

      if (response.status === 200) {
        setNotes(response?.data.messages);
        setMessageCount(response?.data.messages_count);
        setTotalValues(response?.data.total_values);
        console.log(response?.data.total_values.total_views);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = (id) => {
    setMessageId(id);
    setShow(true);
  };
  console.log("notesObj", notes);
  const duplicateMessage = async (messageId) => {
    try {
      setLoading(true);
      // Fetch details of the existing message
      const existingMessageResponse = await axiosInstance.get(
        `/api/message_view/${messageId}/`,
        {
          headers: {
            Authorization: "Bearer " + String(token),
          },
        }
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
          users: user,
          message_name: `Copy of ${existingMessage.message_name}`,
        },
        {
          headers: {
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (duplicateMessageResponse.status !== 200) {
        console.error("Failed to create a duplicate message");
        return;
      }

      const newMessage = duplicateMessageResponse.data.note.id;
      const elementList = existingMessageResponse.data.elements;

      elementList?.map(async (element) => {
        const formData = new FormData();

        if (element.element_type === "Img") {
          try {
            const response = await fetch(`${BASE_URL}${element.image}`);
            const blob = await response.blob();
            const fileImage = new File([blob], "image.png", {
              type: "image/png",
            });
            formData.append("image", fileImage);
          } catch (error) {
            console.error("Error fetching or processing image:", error);
          }
        } else if (element.element_type === "Text") {
          formData.append("text", element.text);
          formData.append("alignment", element.alignment);
        } else if (element.element_type === "Button") {
          formData.append("button_title", element.button_title);
          formData.append("button_link", element.button_link);
          formData.append("button_color", element.button_color);
        }
        formData.append("element_type", element.element_type);
        formData.append("order", element.order);
        formData.append("message", newMessage);

        try {
          let response = await axiosInstance.post(
            "/api/create_element/",
            formData,
            {
              headers: {
                Authorization: "Bearer " + String(token),
              },
            }
          );
          if (response.status === 200) {
          }
        } catch (e) {
          console.log(e);
        }
      });
      setLoading(false);
    } catch (error) {
      console.error("Error duplicating message:", error);
    }
  };

  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center xl:mb-3">
            <h3 class="xl:text-3xl text-2xl font-extralight text-left text-white">
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

          <div className="flex gap-4">
            <div className="flex-none">
              <div className="flex flex-col h-40 w-72 bg-darkestGray rounded-md">
                <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 h-8 text-blue-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>

                  {totalValues ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-gradient text-6xl font-light ml-2"
                    >
                      {messageCount}
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-4xl ml-2">
                      <svg
                        aria-hidden="true"
                        class="w-7 h-8 mt-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </p>
                  )}

                  <p className="text-white text-2xl font-light text-justify ml-3">
                    Sent <br></br>messages
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-none">
              <div className="flex flex-col h-40 w-72 bg-darkestGray rounded-md">
                <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 h-8 text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {totalValues ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-gradient text-6xl font-light ml-2"
                    >
                      {totalValues.total_views}
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-4xl ml-2">
                      <svg
                        aria-hidden="true"
                        class="w-7 h-8 mt-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </p>
                  )}
                  <p className="text-white text-2xl font-light text-justify ml-3">
                    Total <br></br>Views
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-none">
              <div className="flex flex-col h-40 w-72 bg-darkestGray rounded-md">
                <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 text-red-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {totalValues ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-gradient-red text-6xl font-light ml-2 flex flex-row"
                    >
                      {totalValues.bounce_rate}
                      <p className="text-4xl font-light">%</p>
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-4xl ml-2">
                      <svg
                        aria-hidden="true"
                        class="w-7 h-8 mt-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </p>
                  )}
                  <p className="text-white text-2xl font-light text-justify ml-2">
                    Bounce <br></br>Rate
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-none">
              <div className="flex flex-col h-40 w-72 bg-darkestGray rounded-md">
                <div className="p-4 flex items-start flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 h-8 text-green-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  {totalValues ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-gradient-green text-6xl font-light ml-2 flex flex-row"
                    >
                      {totalValues.overall_perf}
                      <p className="text-4xl font-light">%</p>
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-4xl ml-2">
                      <svg
                        aria-hidden="true"
                        class="w-7 h-8 mt-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </p>
                  )}
                  <p className="text-white text-2xl font-light text-justify ml-3">
                    Overall <br></br>rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* table content */}
          <div class="items-center justify-center rounded-lg mb-3 w-full">
            <div class="col-span-12">
              <div class="overflow-auto lg:overflow-visible">
                <div class="overflow-x-auto">
                  <div class="my-6">
                    <p className="text-white font-light text-2xl flex items-start my-3">
                      Your latest messages
                    </p>
                    <div class="grid grid-cols-5 gap-4 grid-headers bg-white text-black font-semibold text-sm xl:text-md py-2 px-4 rounded-md mb-2">
                      <div>Name</div>
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
                            class="bg-darkBlue rounded-md text-white font-semibold text-sm"
                          >
                            <div className="mb-2">
                              <div
                                className={`grid grid-cols-5 gap-4 py-2 px-4`}
                              >
                                <p>{message.message_name}</p>
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
                                    <span class="text-xs font-medium leading-none text-center text-white bg-red-400 rounded-full px-4 py-1">
                                      Draft
                                    </span>
                                  ) : message.status === "Scheduled" ? (
                                    <span class="text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse px-2 py-1">
                                      Scheduled
                                    </span>
                                  ) : (
                                    <span class="text-xs font-medium leading-none text-center text-green-100 bg-green-400 rounded-full px-4 py-1">
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
                                        className="w-6 h-6 mx-2 fill-gray-600"
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
                                      className="hover:bg-sky-300 rounded disabled-link mx-2"
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
                                      className="hover:bg-sky-300 rounded mx-2"
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
                                    onClick={() => duplicateMessage(message.id)}
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
                setUpdated={() => setListUpdated(true)}
                listUpdated={listUpdated}
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
