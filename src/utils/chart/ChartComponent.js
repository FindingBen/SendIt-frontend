import React, { useEffect, useRef, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

function ChartComponent({ chartData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Extract information from chartData and transform it into the desired format

    const transformedData = chartData?.data.sorted_data.map((dataPoint) => {
      const { date, screenViews } = dataPoint;
      return {
        date: date,
        screenViews: screenViews,
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
