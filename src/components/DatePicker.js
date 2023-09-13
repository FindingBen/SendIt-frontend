import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ startDate, endDate }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [startDatevalue, setStartDate] = useState(yesterday);
  const [endDateValue, setEndDate] = useState(today);

  const handleStartDate = (date) => {
    setStartDate(date);
    startDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
    endDate(date);
  };

  return (
    <div date-rangepicker class="flex items-center">
      <div class="relative">
        <DatePicker
          selected={startDatevalue}
          onChange={handleStartDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Start date"
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        ></DatePicker>
      </div>
      <span class="mx-4 text-gray-500">to</span>
      <div class="relative">
        <DatePicker
          selected={endDateValue}
          onChange={handleEndDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="End date"
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        ></DatePicker>
      </div>
    </div>
  );
};

export default DatePickerComponent;
