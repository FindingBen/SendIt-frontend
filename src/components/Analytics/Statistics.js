import React from "react";
import { motion } from "framer-motion";
import SvgLoader from "../SvgLoader";

const Statistics = ({ views }) => {
  return (
    <div className="flex-initial bg-slate-800 w-80 h-96 rounded-2xl">
      <div className="flex flex-col">
        <div className="p-4 flex flex-col bg-darkBlue h-80 rounded-2xl mx-3 my-3 shadow-lg relative">
          <p className="text-white text-2xl font-light text-justify p-2">
            Other statistics
          </p>

          <div className="flex flex-col p-2">
            <div className="flex flex-row p-1 relative">
              <p className="text-white text-normal font-light text-justify">
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
                  className="text-gradient-white text-normal font-light ml-2 absolute right-0"
                >
                  {views?.data.sorted_total_data.bounceRate} %
                </motion.div>
              ) : (
                <p className="text-white font-semibold absolute right-5">
                  <SvgLoader width={"w-5"} height={"h-5"} />
                </p>
              )}
            </div>
            <div className="flex flex-row p-1 relative">
              {" "}
              <p className="text-white text-normal font-light text-justify">
                Engagement rate
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
                  className="text-gradient-white text-normal font-light ml-2 absolute right-0"
                >
                  {views?.data.sorted_total_data.engegment_rate_total} %
                </motion.div>
              ) : (
                <p className="text-white font-semibold absolute right-5">
                  <SvgLoader width={"w-5"} height={"h-5"} />
                </p>
              )}
            </div>
            <div className="flex flex-row p-1 relative">
              {" "}
              <p className="text-white text-normal font-light text-justify">
                Scrolled users
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
                  className="text-gradient-white text-normal font-light ml-2 absolute right-5"
                >
                  {views?.data.sorted_total_data.scrolled_user_total}
                </motion.div>
              ) : (
                <p className="text-white font-semibold absolute right-5">
                  <SvgLoader width={"w-5"} height={"h-5"} />
                </p>
              )}
            </div>
            <div className="flex flex-row p-1 relative">
              {" "}
              <p className="text-white text-normal font-light text-justify">
                User engagement
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
                  className="text-gradient-white text-normal font-light ml-2 absolute -right-5"
                >
                  {views?.data.sorted_total_data.user_engegment_total} secs
                </motion.div>
              ) : (
                <p className="text-white font-semibold absolute right-5">
                  <SvgLoader width={"w-5"} height={"h-5"} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
