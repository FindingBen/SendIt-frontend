import React from "react";
import { ResponsiveBar } from "@nivo/bar";
// import { ChartData as data } from "./ChartData";
import { colors } from "@mui/material";
import { margin } from "@mui/system";

const BarChart = ({ data }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="status"
      margin={{ top: 50, right: 0, bottom: 50, left: 0 }}
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
  );
};

export default BarChart;
