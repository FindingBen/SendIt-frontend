import React, { useEffect, useRef, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label } from "recharts";

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
    <LineChart
      width={750}
      height={300}
      data={data}
      margin={{
        top: 3,
        right: 5,
        left: 5,
      }}
      className="w-100"
    >
      <Line type="monotone" dataKey="screenViews" stroke="#CAC4CF" />
      <CartesianGrid
        horizontal="true"
        vertical="true"
        stroke="#eee"
        strokeDasharray="1"
      />
      <XAxis dataKey="date" label="Dates" />
      <YAxis>
        <Label
          value="Views"
          color="#CAC4CF"
          angle={-90}
          position="insideLeft"
          style={{ textAnchor: "middle" }}
        />
      </YAxis>
    </LineChart>
  );
}

export default ChartComponent;
