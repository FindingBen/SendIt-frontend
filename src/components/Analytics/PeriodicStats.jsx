import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { colors } from "@mui/material";
const PeriodicStats = ({ data }) => {
  //   data = [
  //     {
  //       date: "AD",
  //       "hot dog": 142,
  //       "hot dogColor": "hsl(210, 70%, 50%)",
  //       burger: 20,
  //       burgerColor: "hsl(291, 70%, 50%)",
  //       sandwich: 41,
  //       sandwichColor: "hsl(104, 70%, 50%)",
  //     },
  //     {
  //       date: "AE",
  //       "hot dog": 13,
  //       "hot dogColor": "hsl(306, 70%, 50%)",
  //       burger: 35,
  //       burgerColor: "hsl(238, 70%, 50%)",
  //       sandwich: 110,
  //       sandwichColor: "hsl(166, 70%, 50%)",
  //     },
  //     {
  //       date: "AF",
  //       "hot dog": 40,
  //       "hot dogColor": "hsl(92, 70%, 50%)",
  //       burger: 67,
  //       burgerColor: "hsl(225, 70%, 50%)",
  //       sandwich: 196,
  //       sandwichColor: "hsl(134, 70%, 50%)",
  //     },
  //     {
  //       date: "AG",
  //       "hot dog": 166,
  //       "hot dogColor": "hsl(132, 70%, 50%)",
  //       burger: 106,
  //       burgerColor: "hsl(266, 70%, 50%)",
  //       sandwich: 39,
  //       sandwichColor: "hsl(243, 70%, 50%)",
  //     },
  //     {
  //       date: "AI",
  //       "hot dog": 49,
  //       "hot dogColor": "hsl(129, 70%, 50%)",
  //       burger: 79,
  //       burgerColor: "hsl(334, 70%, 50%)",
  //       sandwich: 67,
  //       sandwichColor: "hsl(189, 70%, 50%)",
  //     },
  //     {
  //       date: "AL",
  //       "hot dog": 173,
  //       "hot dogColor": "hsl(275, 70%, 50%)",
  //       burger: 18,
  //       burgerColor: "hsl(182, 70%, 50%)",
  //       sandwich: 35,
  //       sandwichColor: "hsl(95, 70%, 50%)",
  //     },
  //     {
  //       date: "AM",
  //       "hot dog": 36,
  //       "hot dogColor": "hsl(179, 70%, 50%)",
  //       burger: 191,
  //       burgerColor: "hsl(246, 70%, 50%)",
  //       sandwich: 86,
  //       sandwichColor: "hsl(301, 70%, 50%)",
  //     },
  //   ];
  return (
    <div className="flex flex-col gap-2">
      {/* <p className="text-white text-normal font-semibold text-justify p-2">
        Audience metrics
      </p> */}
      <div className="flex flex-row w-[100%] h-[280px] rounded-2xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 relative">
        <ResponsiveBar
          data={data}
          keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
          indexBy="date"
          margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
          padding={0.45}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "purples" }}
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
            legend: "country",
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
        <div className="flex flex-col p-2 gap-2 items-start">
          <div className="text-justify items-start">
            <p className="text-lg text-white font-semibold">854</p>
            <p className="text-white/50 font-light text-sm">Avg. Session</p>
          </div>
          <div className="text-justify items-start">
            <p className="text-lg text-white font-semibold">3m 21sec</p>
            <p className="text-white/50 font-light text-sm">
              Avg. Session Duration
            </p>
          </div>
          <div className="text-justify items-start">
            <p className="text-lg text-white font-semibold">22</p>
            <p className="text-white/50 font-light text-sm">
              Avg. Scrolled users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicStats;
