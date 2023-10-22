import React, { useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import ChartComponent from "../utils/chart/ChartComponent";
import { ChartData } from "../utils/chart/ChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerComponent from "../components/DatePicker";

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

  const [chartData, setChartData] = useState();
  const params = useParams();

  useEffect(() => {
    getdataAnalytics();
    getSms();
  }, [startDateValue, endDateValue]);

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
  console.log(sms);
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
  console.log(sms);
  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center mb-3">
            <h3 class="text-3xl font-extralight text-left text-white/50">
              Analytics dashboard
            </h3>
          </div>
          <div className="flex flex-row">
            <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-base">
              <h3 className="flex flex-row mx-3 my-3">
                <p className="text-1xl font-extralight text-left">
                  Total views
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                  data-tooltip-target="tooltip-default"
                  type="button"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </h3>
              {views ? (
                <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl">
                  {views?.data.sorted_total_data.screen_views_total}
                </h2>
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </div>
            <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-base">
              <h3 className="flex flex-row mx-3 my-3">
                <p className="text-1xl font-extralight text-left">
                  Total sends
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                  data-tooltip-target="tooltip-default"
                  type="button"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </h3>
              {views ? (
                <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl">
                  {sms?.sms_sends}
                </h2>
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </div>
            <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-base">
              <h3 className="flex flex-row mx-3 my-3">
                <p className="text-1xl font-extralight text-left">Click rate</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                  data-tooltip-target="tooltip-default"
                  type="button"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </h3>
              {views ? (
                <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl">
                  {(sms?.click_number / sms?.sms_sends) * 100} %
                </h2>
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </div>
            <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-base">
              <h3 className="flex flex-row mx-3 my-3">
                <p className="text-1xl font-extralight text-left">
                  Engagement rate
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                  data-tooltip-target="tooltip-default"
                  type="button"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </h3>
              {views ? (
                <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl">
                  {views?.data.sorted_total_data.engegment_rate_total * 100} %
                </h2>
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </div>
            <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-base">
              <h3 className="flex flex-row mx-3 my-3">
                <p className="text-1xl font-extralight text-left">
                  User engagement
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                  data-tooltip-target="tooltip-default"
                  type="button"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </h3>
              {views ? (
                <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl flex flex-row">
                  {views?.data.sorted_total_data.user_engegment_total}{" "}
                  <p className="text-3xl ml-3 mt-1">sec</p>
                </h2>
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </div>
            <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-base">
              <h3 className="flex flex-row mx-3 my-3">
                <p className="text-1xl font-extralight text-left">
                  Scrolled users
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 xl:w-5 xl:h-5 ml-2"
                  data-tooltip-target="tooltip-default"
                  type="button"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
              </h3>
              {views ? (
                <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl">
                  {views?.data.sorted_total_data.scrolled_user_total}{" "}
                </h2>
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row mt-3">
            <div class="bg-darkPurple rounded-lg p-4 md:p-6 xl:w-50 relative mr-5">
              <div className="absolute top-4 right-10">
                <DatePickerComponent
                  startDate={handleStartDateChange}
                  endDate={handleEndDateChange}
                ></DatePickerComponent>
              </div>
              <div class="flex flex-row max-w-sm mb-2">
                <h3 className="flex flex-row mx-3 my-3">
                  <p className="text-2xl font-extralight text-grayWhite">
                    Users view over time
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 ml-2 text-grayWhite"
                    data-tooltip-target="tooltip-default"
                    type="button"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <div
                    id="tooltip-default"
                    role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                  >
                    Tooltip content
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </h3>
              </div>
              <ChartComponent chartData={views} />
            </div>
            <div className="flex flex-col">
              <div className="bg-darkPurple w-60 xl:h-44 xl:w-86 rounded text-grayWhite mr-5">
                <h3 className="flex flex-row mx-3 my-3">
                  <p className="text-md xl:text-1xl font-extralight text-left">
                    Sms send status
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 xl:w-5 xl:h-5 ml-2"
                    data-tooltip-target="tooltip-default"
                    type="button"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <div
                    id="tooltip-default"
                    role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                  >
                    Tooltip content
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </h3>
                <div className="flex flex-row justify-center">
                  <div className="h-40 w-36 border-r-50">
                    <p>Successfull</p>
                    <h3 className="text-2xl text-green-500 mt-4">
                      {sms?.delivered}
                    </h3>
                  </div>
                  <div className="h-40 w-36">
                    <p>Failed</p>
                    <h3 className="text-2xl text-red-500 mt-4">
                      {sms?.not_delivered}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-darkPurple h-24 w-44 xl:h-32 xl:w-60 rounded text-grayWhite mr-5 text-sm xl:text-bas mt-3">
                <h3 className="flex flex-row mx-3 my-3">
                  <p className="text-1xl font-extralight text-left">
                    Bounce rate
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 xl:w-5 xl:h-5 ml-2"
                    data-tooltip-target="tooltip-default"
                    type="button"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <div
                    id="tooltip-default"
                    role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                  >
                    Tooltip content
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </h3>
                {views ? (
                  <h2 class="text-left mx-3 my-3 text-4xl xl:text-5xl">
                    {views?.data.sorted_total_data.bounceRate * 100} %
                  </h2>
                ) : (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 mx-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
