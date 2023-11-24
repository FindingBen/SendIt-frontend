import React, { useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import BarChart from "../utils/chart/BarChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerComponent from "../components/DatePicker";
import { motion } from "framer-motion";

const AnalyticsPage = () => {
  const axiosInstance = useAxiosInstance();
  const [views, setViews] = useState();
  const [sms, setSms] = useState();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedStartDate = formatDate(yesterday);
  const formattedEndDate = formatDate(today);

  const [startDateValue, setStartDate] = useState(formattedStartDate);
  const [endDateValue, setEndDate] = useState(formattedEndDate);

  const params = useParams();

  useEffect(() => {
    getdataAnalytics();
    getSms();
  }, [startDateValue, endDateValue]);
  console.log(views);
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    // Get year, month, and day components
    const year = date.getFullYear();
    // JavaScript months are 0-based, so we add 1 to get the correct month.
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Create the formatted date string in the desired format (YYYY-MM-DD)
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  const handleStartDateChange = (date) => {
    const formatedStartDate = formatDate(date);
    setStartDate(formatedStartDate);
  };

  const handleEndDateChange = (date) => {
    const formatedEndDate = formatDate(date);
    setEndDate(formatedEndDate);
  };

  const getSms = async () => {
    try {
      let response = await axiosInstance.get(`sms/sms/${params.id}`);
      if (response.status === 200) {
        setSms(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getdataAnalytics = async () => {
    try {
      let response = await axiosInstance.get(
        `api/get_analytcs/${params.id}/?startDate=${startDateValue}&endDate=${endDateValue}`
      );
      if (response.status === 200) {
        setViews(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center mb-3">
            <h3 class="xl:text-3xl text-2xl font-extralight text-left text-white/50">
              Analytics dashboard
            </h3>
          </div>

          <div className="flex gap-3">
            <div className="flex-none bg-lightBlue h-full w-80 rounded-md">
              <div className="flex flex-col">
                <div className="flex flex-row p-2 gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 text-white"
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

                  <p className="text-white font-semibold text-xl">
                    Total views
                  </p>
                </div>
                <div className="flex items-start p-2">
                  {views ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white font-semibold text-3xl duration-300 opacity-100 transition-opacity"
                    >
                      {views?.data.sorted_total_data.screen_views_total}
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-3xl">
                      <svg
                        aria-hidden="true"
                        class="w-9 h-9 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </div>
              </div>
            </div>
            <div className="flex-none bg-lightBlue h-[100%] w-80 rounded-md">
              <div className="flex flex-col">
                <div className="flex flex-row p-2 gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                    />
                  </svg>

                  <p className="text-white font-semibold text-xl">
                    Total clicks
                  </p>
                </div>
                <div className="flex items-start p-2">
                  {views ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white font-semibold text-3xl duration-300 opacity-100 transition-opacity"
                    >
                      {sms?.click_number ?? 0}
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-3xl">
                      <svg
                        aria-hidden="true"
                        class="w-9 h-9 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </div>
              </div>
            </div>
            <div className="flex-none bg-lightBlue h-[100%] w-80 rounded-md">
              <div className="flex flex-col">
                <div className="flex flex-row p-2 gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>

                  <p className="text-white font-semibold text-xl">
                    Total sends
                  </p>
                </div>
                <div className="flex items-start p-2">
                  {views ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0, 0.41, 0.1, 1.01],
                      }}
                      className="text-white font-semibold text-3xl duration-300 opacity-100 transition-opacity"
                    >
                      {sms?.sms_sends ?? 0}
                    </motion.div>
                  ) : (
                    <p className="text-white font-semibold text-3xl">
                      <svg
                        aria-hidden="true"
                        class="w-9 h-9 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div className="flex gap-3 mt-3">
            <div className="flex-initial bg-lightBlue w-96 h-96 rounded-md">
              <div className="flex flex-col">
                <div className="flex flex-row relative">
                  <p className="text-white font-bold text-2xl p-4">
                    Other statistics
                  </p>
                  <div className="absolute right-2 top-2">
                    <img
                      width={70}
                      src={require("../../src/assets/snipLogo.PNG")}
                    />
                  </div>
                </div>
                <div className="flex flex-col p-4">
                  <div className="flex flex-row p-1 relative">
                    <p className="text-white font-semibold">Bounce rate</p>
                    {views ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="text-white font-bold absolute right-5"
                      >
                        {views?.data.sorted_total_data.bounceRate * 100} %
                      </motion.div>
                    ) : (
                      <p className="text-white font-semibold absolute right-5">
                        <svg
                          aria-hidden="true"
                          class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  </div>
                  <div className="flex flex-row p-1 relative">
                    {" "}
                    <p className="text-white font-semibold">Engagement rate</p>
                    {views ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="text-white font-bold absolute right-5"
                      >
                        {views?.data.sorted_total_data.engegment_rate_total *
                          100}{" "}
                        %
                      </motion.div>
                    ) : (
                      <p className="text-white font-semibold absolute right-5">
                        <svg
                          aria-hidden="true"
                          class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  </div>
                  <div className="flex flex-row p-1 relative">
                    {" "}
                    <p className="text-white font-semibold">Scrolled users</p>
                    {views ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="text-white font-bold absolute right-5"
                      >
                        {views?.data.sorted_total_data.scrolled_user_total}
                      </motion.div>
                    ) : (
                      <p className="text-white font-semibold absolute right-5">
                        <svg
                          aria-hidden="true"
                          class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  </div>
                  <div className="flex flex-row p-1 relative">
                    {" "}
                    <p className="text-white font-semibold">User engagement</p>
                    {views ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="text-white font-bold absolute right-5"
                      >
                        {views?.data.sorted_total_data.user_engegment_total}{" "}
                        secs
                      </motion.div>
                    ) : (
                      <p className="text-white font-semibold absolute right-5">
                        <svg
                          aria-hidden="true"
                          class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-none bg-lightBlue w-80 rounded-md">
              <div className="flex flex-row relative">
                <p className="text-white font-bold text-2xl p-4">
                  Sms delivery
                </p>
                <div className="absolute right-4 top-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-10 h-10 text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex h-72">
                <BarChart />
              </div>
            </div>
            <div className="flex-initial">
              <div className="flex-initial bg-lightBlue w-64 h-60 rounded-md">
                <div className="flex flex-col items-center">
                  <p className="text-white font-bold text-2xl">
                    Sms performance
                  </p>
                  <img width={190} src={require("../assets/sampleImg.PNG")} />
                  <p className="text-white/50 font-light text-sm">
                    Overall performance of the sms including the metrics
                  </p>
                </div>
              </div>
              <div className="bg-lightBlue w-64 h-32 mt-3 rounded"></div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
