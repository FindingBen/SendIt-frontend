import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
const SmsPill = () => {
  const { currentUser, currentPackageState, currentToken } = useRedux();
  const navigate = useNavigate();

  const redirectToUserPageWithPlansTab = () => {
    navigate(`/account_settings/${currentUser}/?tab=plans`);
  };
  const sms_value = jwt_decode(currentToken);
  console.log(currentToken);
  return (
    <div className="flex flex-row bg-darkBlue h-10 w-40 rounded-2xl relative shadow-md">
      <div className="rounded-2xl text-white my-auto ml-2">
        Credits: {sms_value.sms_count}
      </div>
      <div className="bg-white rounded-2xl absolute right-2 top-2 text-black px-2 hover:cursor-pointer hover:bg-white/50">
        <div
          onClick={redirectToUserPageWithPlansTab}
          className="my-auto mx-auto"
        >
          +
        </div>
      </div>
    </div>
  );
};

export default SmsPill;
