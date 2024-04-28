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
import PeriodicStats from "../components/Analytics/PeriodicStats";

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
  const [periodData, setPeriodData] = useState([]);
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
        setPeriodData(response.data.period_data);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(periodData);
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
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row">
          <div class="flex-1">
            <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
              <h3 class="xl:text-3xl text-2xl font-semibold text-left text-white mx-20">
                Analytics dashboard
              </h3>
            </div>

            <div className="grid grid-cols-2 grid-rows-1 gap-2 mx-20">
              <div className="flex flex-row gap-3 w-full">
                <div className="flex flex-col gap-2">
                  <div className="p-2 flex flex-row items-center h-[125px] w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
                          <SvgLoader width={"w-10"} height={"h-10"} />
                        </p>
                      )}
                    </div>
                    <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
                      Total views
                    </p>
                  </div>
                  <div className="p-2 flex flex-row items-center h-[125px] w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
                          <SvgLoader width={"w-10"} height={"h-10"} />
                        </p>
                      )}
                    </div>
                    <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
                      Total clicks
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="p-2 flex flex-row items-center h-[125px] w-[275px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
                          <SvgLoader width={"w-10"} height={"h-10"} />
                        </p>
                      )}
                    </div>
                    <p className="text-white text-normal font-semibold text-justify absolute right-2 bottom-2">
                      Total sends
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[70%] flex-1">
                <Statistics views={views} />
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-1 gap-2 mt-2 mx-20">
              <div className="flex-1 w-full">
                <PeriodicStats data={periodData} />
              </div>
              <div className="flex flex-row gap-2 w-full">
                <BarChart data={dataDlivery} />
                <SurveyResults surveyResults={surveyresults} />
              </div>
            </div>
            {/* <div className="flex flex-row gap-3 mx-20">
              <BarChart data={dataDlivery} />
              <PeriodicStats />
             
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
