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
    // <></>
  );
};

export default SmsPill;
