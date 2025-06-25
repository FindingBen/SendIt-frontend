import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import { logOut } from "../../redux/reducers/authSlice";
import { clearMessages } from "../../redux/reducers/messageReducer";
import { cleanContactLists } from "../../redux/reducers/contactListReducer";
import { cleanUser } from "../../redux/reducers/userReducer";
import { clearCampaigns } from "../../redux/reducers/completedCampaignsReducer";
import { cleanPackage } from "../../redux/reducers/packageReducer";
import { setModalState } from "../../redux/reducers/modalReducer";

const SmsPill = () => {
  const { currentUser, currentSmsPackCount, currentToken, dispatch } =
    useRedux();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatNumberWithSeparators = (number) => {
    if (number !== "undefined") {
      return number.toLocaleString("de-DE");
    } else {
      return "None";
    } // German locale, uses period for thousand separator
  };

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(cleanPackage());
    dispatch(clearMessages());
    dispatch(cleanContactLists());
    dispatch(clearMessages());
    dispatch(cleanUser());
    dispatch(clearCampaigns());
    setDropdownOpen(false);
    navigate("/login");
    localStorage.removeItem("refreshToken");
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
      <div ref={dropdownRef} className="relative">
        <div
          onClick={() => setDropdownOpen((open) => !open)}
          className="flex flex-row gap-1 rounded-lg h-10 hover:bg-slate-500 cursor-pointer relative shadow-xl bg-gradient-to-b from-lighterMainBlue to-mainBlue border-2 border-gray-800 px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 text-white/70 ml-2 my-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <span className="text-white font-euclid mr-2 my-auto">Account</span>
          <svg
            className="w-4 h-4 text-white my-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
            <Link
              to={`/account_settings/${currentUser}`}
              className="block px-4 py-2 text-gray-800 hover:bg-ngrokBlue hover:text-white rounded-t-lg transition"
              onClick={() => setDropdownOpen(false)}
            >
              Account Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white rounded-b-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsPill;
