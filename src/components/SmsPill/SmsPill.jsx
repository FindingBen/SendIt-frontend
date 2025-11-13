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

  const smsCount = currentSmsPackCount || 0;
  return (
   <div className="flex flex-row gap-4 items-center ml-auto mr-20">
  {/* Credits Pill */}
  <div className="flex items-center justify-between px-4 py-2 w-56 rounded-xl bg-[#1B2233] shadow-[0_4px_16px_rgba(0,0,0,0.35)] text-gray-200">
    <span className="text-gray-300 font-medium">
      Credits: {formatNumberWithSeparators(smsCount)}
    </span>
    <Link
      to={"/plans/"}
      className="bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-80 rounded-lg px-3 py-1 text-sm font-semibold text-white transition-all duration-200 shadow-[0_0_12px_rgba(73,55,186,0.25)]"
    >
      Top up
    </Link>
  </div>

  {/* Account Dropdown */}
  <div ref={dropdownRef} className="relative">
    <div
      onClick={() => setDropdownOpen((open) => !open)}
      className="flex items-center gap-2 bg-[#1B2233] hover:bg-[#242E44] rounded-xl cursor-pointer px-4 py-2 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
    >
      {/* User Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-[#9CA3AF]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>

      <span className="text-gray-200 font-medium">Account</span>

      {/* Dropdown arrow */}
      <svg
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          dropdownOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    {/* Dropdown menu */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-3 w-48 bg-[#1F273A] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-[#2A3148]/40 z-50 backdrop-blur-md">
        <Link
          to={`/account_settings/${currentUser}`}
          className="block px-4 py-3 text-gray-200 hover:bg-[#3E6FF4]/15 hover:text-[#3E6FF4] rounded-t-xl transition-all duration-150"
          onClick={() => setDropdownOpen(false)}
        >
          Account Settings
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-3 text-gray-200 hover:bg-red-600/80 hover:text-white rounded-b-xl transition-all duration-150"
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
