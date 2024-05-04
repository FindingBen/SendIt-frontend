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
            <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
              <h3 class="xl:text-3xl text-2xl font-semibold text-left text-white mx-20">
                Analytics dashboard
              </h3>
            </div>

            <div className="grid grid-cols-2 grid-rows-1 gap-2 mx-20">
              <div className="flex flex-row gap-3 w-full">
                <StatCards views={views} sms={sms} />
              </div>
              <div className="w-[100%] flex-1">
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
