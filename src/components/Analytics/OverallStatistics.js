import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { SpinLoading } from "respinner";
import SvgLoader from "../SvgLoader";

const stats = [
  { key: "total_sends", label: "Total sends" },
  { key: "total_views", label: "Total views" },
  { key: "total_clicks", label: "Total clicks" },
  { key: "clicks_rate", label: "Clicks rate %" },
  { key: "total_spend", label: "Total spend" },
];

const OverallStatistics = ({ totalValues, loaded = true }) => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#23253a] px-4 py-6 shadow-md">
        {stats.map((stat, index) => (
          <div
            key={stat.key}
            className={`flex flex-col items-center justify-center flex-1 relative ${
              index !== stats.length - 1 ? "border-r border-white/10" : ""
            }`}
          >
            {!loaded ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-[#3e6ff4] text-2xl font-semibold"
              >
                {totalValues?.[stat.key] ?? 127}
              </motion.p>
            ) : (
              <SpinLoading size={30} fill="#3e6ff4" />
            )}

            <p className="text-white text-sm mt-2 tracking-wide font-light">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallStatistics;
