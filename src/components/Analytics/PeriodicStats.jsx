import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { colors } from "@mui/material";
const PeriodicStats = ({ data, avgData }) => {
  const barColors = {
    engegmentRate: "#5b21b6", // Customize color for engagement rate
    scrolledUser: "#a78bfa", // Customize color for scrolled users
    screenViews: "#1e3a8a", // Customize color for screen views
  };

  return (
    <div className="flex flex-col gap-2">
      {/* <p className="text-white text-normal font-semibold text-justify p-2">
        Audience metrics
      </p> */}
      <div className="flex flex-row w-[100%] h-[288px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
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
      </div>
    </div>
  );
};

export default PeriodicStats;
