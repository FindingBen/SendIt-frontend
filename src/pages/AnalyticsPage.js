import React, { useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import BarChart from "../utils/chart/BarChart";
import SvgLoader from "../components/SvgLoader";
import PieChart from "../utils/chart/PieChart";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import SurveyResults from "../components/Survey/SurveyResults";
import Statistics from "../components/Analytics/Statistics";
import formatDate from "../utils/helpers/dateFunction";

const AnalyticsPage = () => {
  const axiosInstance = useAxiosInstance();
  const [views, setViews] = useState();
  const [sms, setSms] = useState();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedStartDate = formatDate(yesterday);
  const formattedEndDate = formatDate(today);
  const [surveyresults, setSurveyResults] = useState();
  const [startDateValue, setStartDate] = useState(formattedEndDate);
  const [endDateValue, setEndDate] = useState(formattedEndDate);
  const dataDlivery = [
    { status: "delivered", value: sms?.delivered },
    { status: "not delivered", value: sms?.not_delivered },
  ];
  const params = useParams();

  useEffect(() => {
    const startDateToUpdate = sms?.created_at
      ? formatDate(sms?.created_at)
      : formattedStartDate;
    setStartDate(startDateToUpdate);

    getSms();
    getSurveyResponse();
    getdataAnalytics();
  }, []);

  // function formatDate(inputDate) {
  //   const date = new Date(inputDate);

  //   // Get year, month, and day components
  //   const year = date.getFullYear();
  //   // JavaScript months are 0-based, so we add 1 to get the correct month.
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");

  //   // Create the formatted date string in the desired format (YYYY-MM-DD)
  //   const formattedDate = `${year}-${month}-${day}`;

  //   return formattedDate;
  // }

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
        console.log(response);
        setViews(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSurveyResponse = async () => {
    try {
      let response = await axiosInstance.get(
        `api/get_survey_results/${params.id}`
      );
      if (response.status === 200) {
        setSurveyResults(response.data.survey_responses);
      }
    } catch (error) {}
  };

  return (
    <section className="h-screen flex-d w-100 items-center justify-center">
      <div className="flex flex-row p-4">
        <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:my-2 sm:mx-4 sm:rounded-2xl">
          <div className="flex-1 px-2 sm:px-0">
            <div className="flex justify-between items-center mb-3">
              <h3 class="xl:text-3xl text-2xl font-extralight text-left text-white/50">
                Analytics dashboard
              </h3>
            </div>

            <div className="flex flex-row gap-3">
              <div className="flex-none bg-darkestGray w-72 rounded-md">
                <div className="flex flex-col">
                  <div className="p-2 flex flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
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
                          className="text-gradient-white text-4xl font-light ml-2 duration-300 opacity-100 transition-opacity"
                        >
                          {views?.data.sorted_total_data.screen_views_total}
                        </motion.div>
                      ) : (
                        <p className="ml-2">
                          <SvgLoader width={"w-8"} height={"h-8"} />
                        </p>
                      )}
                    </div>
                    <p className="text-white text-2xl font-light text-justify ml-3 p-2">
                      Total views
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-none bg-darkestGray h-[100%] w-72 rounded-md">
                <div className="flex flex-col">
                  <div className="p-2 flex flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
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
                          className="text-gradient-white text-4xl font-light ml-2 duration-300 opacity-100 transition-opacity"
                        >
                          {sms?.click_number ?? 0}
                        </motion.div>
                      ) : (
                        <p className="ml-2">
                          <SvgLoader width={"w-8"} height={"h-8"} />
                        </p>
                      )}
                    </div>
                    <p className="text-white text-2xl font-light text-justify ml-3 p-2">
                      Total clicks
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-none bg-darkestGray h-[100%] w-72 rounded-md">
                <div className="flex flex-col">
                  <div className="p-2 flex flex-row bg-darkBlue rounded-md mx-3 my-3 shadow-lg">
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
                          className="text-gradient-white text-4xl font-light ml-2 duration-300 opacity-100 transition-opacity"
                        >
                          {sms?.sms_sends ?? 0}
                        </motion.div>
                      ) : (
                        <p className="ml-2">
                          <SvgLoader width={"w-8"} height={"h-8"} />
                        </p>
                      )}
                    </div>
                    <p className="text-white text-2xl font-light text-justify ml-3 p-2">
                      Total sends
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <Statistics views={views} />
              <BarChart data={dataDlivery} />
              <PieChart
                viewType={"AnalyticsView"}
                percentage={views?.data.overall_perf}
              />
            </div>
          </div>
        </div>
        <SurveyResults surveyResults={surveyresults} />
      </div>
    </section>
  );
};

export default AnalyticsPage;
