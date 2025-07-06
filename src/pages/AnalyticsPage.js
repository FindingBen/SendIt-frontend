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
import { Link } from "react-router-dom";
import Search from "../components/SearchComponent/Search";
import SmsPill from "../components/SmsPill/SmsPill";

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
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex flex-col">
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-16 bg-navBlue sticky top-0 z-10">
          <Link to={"/welcome"}>
            <img
              src={require("../assets/noBgLogo.png")}
              width={65}
              alt="logo"
              className="mt-2"
            />
          </Link>
          <h3 className="2xl:text-3xl lg:text-xl text-lg font-normal text-left font-euclid text-white mx-5">
            Sendperplane
          </h3>

          <Search />

          <SmsPill />
        </div>
        <div className="ml-44 mb-5">
          <div className="flex justify-between items-center h-20">
            <h3 class="xl:text-2xl text-xl font-normal text-left text-white mx-20">
              Active campaign analytics
            </h3>
          </div>

          <div className="grid grid-cols-5 gap-4 mx-20">
            <div className="col-span-5">
              <StatCards sms={sms} views={views} />
            </div>
            <div className="col-span-3 row-start-2">
              <PeriodicStats data={periodData} avgData={avgDataValues} />
            </div>
            <div className="col-span-2 col-start-4 row-start-2">
              <ButtonAnalytics sms={sms} />
            </div>
            <div className="col-span-3 row-start-3 flex flex-row gap-4">
              <BarChart data={dataDlivery} />
              <SurveyResults surveyResults={surveyresults} />
            </div>
          </div>

          {/* <div className="grid grid-cols-3 grid-rows-1 gap-2 mx-20">
              <div className="flex flex-row gap-3 w-full">
                <StatCards sms={sms} views={views} />
              </div>
              <div className="w-full">
                <ButtonAnalytics sms={sms} />
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
            </div> */}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
