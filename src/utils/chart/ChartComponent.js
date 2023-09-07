import React, { useEffect, useRef, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

function ChartComponent({ chartData }) {
  const [data, setData] = useState([]);
  //   const data = [
  //     { name: "Page A", uv: 400 },
  //     { name: "Page B", uv: 300 },
  //     { name: "Page C", uv: 200 },
  //     { name: "Page D", uv: 100 },
  //   ];

  // Create the chart when chartRef becomes available

  useEffect(() => {
    // Extract information from chartData and transform it into the desired format

    const transformedData = chartData?.data.map((dataPoint) => {
      const { date, screen_views } = dataPoint;
      return {
        date,
        screenViews: screen_views,
      };
    });

    // Update the data state with the transformed data
    setData(transformedData);
  }, [chartData]);

  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="screenViews" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
    </LineChart>
  );
}

export default ChartComponent;
