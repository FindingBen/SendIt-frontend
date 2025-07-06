import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { colors } from "@mui/material";
import { Tooltip } from "react-tooltip";

const PeriodicStats = ({ data, avgData }) => {
  const barColors = {
    engegmentRate: "#5b21b6", // Customize color for engagement rate
    scrolledUser: "#a78bfa", // Customize color for scrolled users
    screenViews: "#1e3a8a", // Customize color for screen views
  };

  return (
    <div className="flex flex-row lg:h-[260px] rounded-2xl bg-ngrokGray border-gray-800 relative">
      <ResponsiveBar
        data={data}
        keys={["engegmentRate", "scrolledUser", "screenViews"]}
        indexBy="date"
        margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
        padding={0.45}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={(bar) => barColors[bar.id]}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#7c3aed",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#7c3aed",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        theme={{
          axis: {
            domain: {
              // line: {
              //   stroke: colors.grey[100],
              // },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              text: {
                fill: colors.grey[100],
              },
            },
          },
        }}
        borderRadius={3}
        borderWidth={2}
        borderColor={{ theme: "background" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Week days",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "values",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        enableGridY={false}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[]}
        animate={false}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Number of clicks and engagements over the course of 7 days while the campaign is active."
        stroke="currentColor"
        class="size-6 text-white/50 absolute right-2 top-2 cursor-pointer"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>
      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default PeriodicStats;
