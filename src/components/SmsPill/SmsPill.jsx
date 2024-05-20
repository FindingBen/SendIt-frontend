import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
const SmsPill = () => {
  const { currentUser, currentSmsPackCount, currentToken } = useRedux();
  const navigate = useNavigate();
  const formatNumberWithSeparators = (number) => {
    if (number !== "undefined") {
      return number.toLocaleString("de-DE");
    } else {
      return "None";
    } // German locale, uses period for thousand separator
  };
  const sms_value = jwt_decode(currentToken);
  console.log("WAR", currentSmsPackCount.sms_count);
  return (
    <div className="flex flex-row h-10 w-40 rounded-2xl relative shadow-lg bg-purpleHaze">
      <div className="rounded-2xl text-white my-auto ml-2">
        Credits: {currentSmsPackCount.sms_count}
      </div>
      <div className="bg-white rounded-2xl absolute right-2 top-2 text-black px-2 hover:cursor-pointer hover:bg-white/50">
        <Link className="my-auto mx-auto" to={"/plans/"}>
          +
        </Link>
      </div>
    </div>
  );
};

export default SmsPill;
