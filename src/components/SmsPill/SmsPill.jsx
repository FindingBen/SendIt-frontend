import React from "react";
import { Link } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
const SmsPill = () => {
  const { currentUser, currentSmsPackCount, currentToken } = useRedux();

  const formatNumberWithSeparators = (number) => {
    if (number !== "undefined") {
      return number.toLocaleString("de-DE");
    } else {
      return "None";
    } // German locale, uses period for thousand separator
  };
  const smsCount = currentSmsPackCount?.sms_count || 0;
  return (
    <div className="flex flex-row gap-3 items-center ml-auto mr-20">
      <div className="flex flex-row h-10 w-52 rounded-lg relative shadow-xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
        <div className="rounded-2xl text-white my-auto ml-2">
          Credits: {formatNumberWithSeparators(smsCount)}
        </div>
        <Link
          to={"/plans/"}
          className="bg-ngrokBlue hover:bg-ngrokBlue/50 rounded-md absolute right-2 top-1.5 text-white px-2 hover:cursor-pointer"
        >
          <p className="my-auto mx-auto">Top up</p>
        </Link>
      </div>
      <div className="flex flex-row gap-1 rounded-lg h-10 hover:bg-slate-500 cursor-pointer relative shadow-xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-white/70 ml-2 my-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span className="text-white font-euclid mr-2 my-auto">Account</span>
      </div>
    </div>
    // <></>
  );
};

export default SmsPill;
