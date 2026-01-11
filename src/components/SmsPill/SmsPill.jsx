import React, { useEffect, useRef, useState } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import { logOut } from "../../redux/reducers/authSlice";
import { clearMessages } from "../../redux/reducers/messageReducer";
import { cleanContactLists } from "../../redux/reducers/contactListReducer";
import { cleanUser } from "../../redux/reducers/userReducer";
import { clearCampaigns } from "../../redux/reducers/completedCampaignsReducer";
import { cleanPackage } from "../../redux/reducers/packageReducer";
import { markAllAsRead, markAsRead } from "../../redux/reducers/notificationReducer";

const SmsPill = () => {
  const { 
    currentUser, 
    currentSmsPackCount, 
    dispatch, 
    currentNotifications, 
    currentUnreadCount 
  } = useRedux();
  const axiosInstance = useAxiosInstance();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatNumberWithSeparators = (number) => number !== undefined ? number.toLocaleString("de-DE") : "None";

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(cleanPackage());
    dispatch(clearMessages());
    dispatch(cleanContactLists());
    dispatch(cleanUser());
    dispatch(clearCampaigns());
    setDropdownOpen(false);
    navigate("/login");
    localStorage.removeItem("refreshToken");
  };

  const smsCount = currentSmsPackCount || 0;

  return (
    <div className="flex flex-row gap-4 items-center ml-auto mr-20">
      {/* Notification Bell */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => {
            setNotifOpen((open) => {
              if (!open && currentUnreadCount > 0) dispatch(markAllAsRead());
              return !open;
            });
          }}
          className="relative p-2 rounded-xl bg-[#1B2233] hover:bg-[#242E44] text-gray-200 transition-colors duration-150"
          aria-label="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0h6z" />
          </svg>
          {currentUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-red-500 text-white">
              {currentUnreadCount ?? 0}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-[#1F273A] rounded-xl shadow-lg border border-[#2A3148]/40 z-50 backdrop-blur-md">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#2A3148]/30 flex items-center justify-between">
              <span className="text-gray-200 font-semibold">Notifications</span>
            </div>

            {/* Notification list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-[#2A3148]/40">
              {currentNotifications && currentNotifications.length > 0 ? (
                currentNotifications
                  .slice()
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 20)
                  .map((notif) => {
                    const isUnread = !notif.read;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.read) dispatch(markAsRead(notif.id));
                          if (notif.product_id) navigate(`/product_optimize/${notif.product_id}`);
                          setNotifOpen(false);
                        }}
                        className={`group px-4 py-3 cursor-pointer transition-colors duration-150 ${
                          isUnread ? "bg-[#242E44]/40" : "bg-transparent"
                        } hover:bg-[#2F3A5A]/50`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-2 h-2 w-2 rounded-full flex-shrink-0 ${isUnread ? "bg-[#3E6FF4]" : "bg-transparent"}`} />
                          <div className="flex-1 text-start">
                            <p className="text-sm text-gray-200 leading-snug">{notif.message}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                              <span>
                                {new Date(notif.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              {notif.notif_type === "success" && (
                                <span className="rounded-full bg-green-500/15 text-green-400 px-2 py-0.5">Completed</span>
                              )}
                              {notif.notif_type === "error" && (
                                <span className="rounded-full bg-red-500/15 text-red-400 px-2 py-0.5">Failed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="px-4 py-6 text-center text-gray-400">No notifications</div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[#2A3148]/30">
              {/* <button onClick={() => navigate("/notifications")} className="w-full text-left text-sm text-[#3E6FF4] hover:underline">
                View all
              </button> */}
            </div>
          </div>
        )}
      </div>

      {/* Credits Pill */}
      <div className="flex items-center justify-between px-4 py-2 w-56 rounded-xl bg-[#1B2233] shadow-[0_4px_16px_rgba(0,0,0,0.35)] text-gray-200">
        <span className="text-gray-300 font-medium">Credits: {formatNumberWithSeparators(smsCount)}</span>
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#9CA3AF]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span className="text-gray-200 font-medium">Account</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

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
