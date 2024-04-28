import React from "react";
import { ResponsiveBar } from "@nivo/bar";
// import { ChartData as data } from "./ChartData";
import { colors } from "@mui/material";

const BarChart = ({ data }) => {
  return (
    <div className="p-2 items-start h-72 w-[35%] flex-col rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
      <div className="flex flex-row">
        <p className="text-white text-2xl font-normal text-justify p-4">
          Sms delivery
        </p>
        <div className="absolute right-4 top-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </div>
      </div>

      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="status"
        margin={{ top: 5, right: 0, bottom: 75, left: 0 }}
        padding={0.5}
        borderRadius={10}
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
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "green_blue" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 6,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#ffff",
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
        borderColor={{ theme: "background" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Sms status",
          legendPosition: "middle",
          legendOffset: 40,
          color: "#ffff",
          truncateTickAt: 0,
        }}
        axisLeft={null}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#fff"
        legends={[]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
      />
    </div>
  );
};

export default BarChart;
