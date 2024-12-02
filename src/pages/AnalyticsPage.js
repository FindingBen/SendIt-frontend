import React, { useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import BarChart from "../utils/chart/BarChart";
import SvgLoader from "../components/SvgLoader";
import StatCards from "../components/Analytics/StatCards";
import "react-datepicker/dist/react-datepicker.css";
import AvgDataStats from "../components/Analytics/AvgDataStats";
import SurveyResults from "../components/Survey/SurveyResults";
import Statistics from "../components/Analytics/Statistics";
import formatDate from "../utils/helpers/dateFunction";
import PeriodicStats from "../components/Analytics/PeriodicStats";
import ButtonAnalytics from "../components/Analytics/ButtonAnalytics";

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
  const [avgDataValues, setAvgDataValues] = useState();
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
        console.log(response.data.avg_data);
        setPeriodData(response.data.period_data);
        setAvgDataValues(response.data.avg_data);
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
    <section className="h-screen w-[100%] items-center justify-center overflow-hidden">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div class="flex-1">
            <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
              <h3 class="xl:text-2xl text-xl font-semibold text-left text-white mx-20">
                Analytics dashboard
              </h3>
              {/* <div class="text-white flex flex-row gap-1 rounded-md mx-20 hover:bg-cyan-600 smooth-hover cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 border-gray-500 border-2 p-1 lg:p-2 absolute right-0 top-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                <p>Export</p>
              </div> */}
            </div>

            <div className="grid grid-cols-3 grid-rows-1 gap-2 mx-20">
              <div className="flex flex-row gap-3 w-full">
                <StatCards sms={sms} views={views} />
              </div>
              <div className="w-full">
                <ButtonAnalytics sms={sms} />
              </div>
              <div className="w-[100%]">
                <Statistics views={views} />
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-1 gap-2 mt-2 mx-20">
              <div className="flex-1 w-full">
                <PeriodicStats data={periodData} avgData={avgDataValues} />
              </div>
              <div className="flex flex-row gap-2 w-full">
                <AvgDataStats avgData={avgDataValues} />
                <BarChart data={dataDlivery} />
                <SurveyResults surveyResults={surveyresults} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
