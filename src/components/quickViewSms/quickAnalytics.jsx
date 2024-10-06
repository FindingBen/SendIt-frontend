import React from "react";
import SvgLoader from "../SvgLoader";
import { motion } from "framer-motion-3d";
import PieChart from "../../utils/chart/PieChart";
import { Link } from "react-router-dom";

const QuickAnalytics = ({
  analyticsOpen,
  views,
  closeAnalyticsDrawer,
  smsId,
}) => {
  return (
    <div
      className={`absolute 2xl:top-[12%] xl:top-[15%] lg:top-[9%] -right-6 h-[548px] w-[320px] xl:h-[548px] xl:w-[350px] 2xl:h-[600px] 2xl:w-[400px] bg-mainBlue border-2 border-gray-800 rounded-2xl shadow-lg transition-transform transform ${
        analyticsOpen
          ? "xl:-translate-x-26 lg:-translate-x-24"
          : "translate-x-full"
      }`}
    >
      <div className="flex flex-col p-4 relative items-center">
        <button
          className="bg-darkBlue hover:bg-gray-700 duration-300 text-white px-2 rounded-full absolute right-3 top-3"
          onClick={closeAnalyticsDrawer}
        >
          X
        </button>
        <p className="text-white text-xl 2xl:text-2xl mb-2">Quick view</p>
        <PieChart percentage={views?.data.overall_perf} viewType={"ViewHome"} />
        <div className="flex flex-col items-center p-4 w-full h-[150px] rounded-lg">
          <div className="flex flex-row relative border-2 border-gray-800 rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue">
            <div className="p-2 flex items-center flex-col rounded-md mx-1 my-auto">
              <p className="text-white 2xl:text-lg xl:text-normal lg:text-sm font-light text-justify">
                Campaign views
              </p>
              {views ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0, 0.41, 0.1, 1.01],
                  }}
                  className="text-white xl:text-2xl lg:text-sm 2xl:text-3xl font-normal shadow-lg"
                >
                  {views?.data.sorted_total_data.screen_views_total}
                </motion.div>
              ) : (
                <p className="text-white font-semibold text-2xl ml-2">
                  <SvgLoader width={"w-8"} height={"h-8"} />
                </p>
              )}
            </div>
            <div className="p-2 flex items-center flex-col rounded-md mx-1 my-auto">
              <p className="text-white text-normal 2xl:text-lg font-light text-justify lg:text-sm">
                Bounce rate
              </p>
              {views ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0, 0.41, 0.1, 1.01],
                  }}
                  className="text-white xl:text-2xl lg:text-sm 2xl:text-3xl font-normal shadow-lg"
                >
                  {views?.data.sorted_total_data.bounceRate} %
                </motion.div>
              ) : (
                <p className="text-white font-semibold text-2xl ml-2 lg:text-sm">
                  <SvgLoader width={"w-8"} height={"h-8"} />
                </p>
              )}
            </div>
          </div>
        </div>
        <Link
          to={`/analytics/${smsId}`}
          className="bg-purpleHaze hover:bg-gray-700 duration-300 px-2 py-1 2xl:px-4 2xl:py-2 2xl:text-lg mt-2 text-white rounded-lg"
        >
          View more
        </Link>
      </div>
    </div>
  );
};

export default QuickAnalytics;
