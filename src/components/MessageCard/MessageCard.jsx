import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export const MessageCard = ({
  message,
  duplicateMessage,
  toggleAnalyticsDrawer,
  deleteMessage,
  archiveMsg,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div
      className={`grid grid-cols-4 lg:grid-cols-5 gap-3 mb-3 2xl:text-lg h-10 items-center`}
      ref={dropdownRef}
    >
      <div className="text-white/90">{message.message_name}</div>
      <div className="text-white/50 md:hidden lg:block">
        {message.created_at}
      </div>
      <div>
        {message.status === "Draft" ? (
          <p>Unavailabe</p>
        ) : message.status === "Scheduled" ? (
          <p>Unavailabe</p>
        ) : (
          <Link
            type="button"
            className="hover:bg-purple-400 rounded cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105"
            to={`/analytics/${message.id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="lg:w-6 lg:h-6 w-4 h-4 2xl:w-8 2xl:h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
          </Link>
        )}
      </div>
      <div>
        {message.status === "Draft" ? (
          <span class="text-xs 2xl:text-normal font-medium leading-none text-center text-white bg-gradient-to-r from-sky-500 to-sky-800 rounded-lg px-3 lg:py-1">
            Draft
          </span>
        ) : message.status === "Scheduled" ? (
          <span class="text-xs 2xl:text-normal font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-lg animate-pulse px-3 lg:py-1">
            Scheduled
          </span>
        ) : (
          <span class="text-xs 2xl:text-normal font-medium leading-none text-center text-white bg-gradient-to-r from-green-500 to-green-800 rounded-lg px-3 lg:py-1">
            Sent
          </span>
        )}
      </div>
      <div className="flex flex-row mt-2">
        <div className=" border-gray-800 rounded-md mx-auto my-auto p-0.5 hover:bg-cyan-500 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
          {message.status === "Draft" ? (
            <Link type="button" to={`/edit_message/${message.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="lg:w-5 lg:h-5 w-4 h-4 2xl:w-7 2xl:h-8 fill-gray-200"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </Link>
          ) : (
            <></>
          )}
        </div>
        {message.status === "Draft" ? (
          <div className="border-gray-800 rounded-md mx-auto my-auto p-0.5 hover:bg-cyan-500  cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
            <Link type="button" className="" to={`/sending_flow/${message.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="lg:w-5 lg:h-5 w-4 h-4 2xl:w-7 2xl:h-8 fill-gray-200 text-black"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <></>
        )}
        <div className="relative border-gray-800 rounded-md mx-auto my-auto p-0.5 hover:bg-cyan-500 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            class="text-white font-medium rounded-lg text-sm text-center inline-flex items-center"
            type="button"
            onClick={handleDropdownToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 2xl:w-7 2xl:h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div
              id="dropdown"
              className="absolute right-3 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 border-gray-800 border-2 mx-auto my-auto p-0.5"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                {message.status === "Draft" ? (
                  <li className="block px-4 py-2 hover:bg-gray-100 text-black">
                    <Link onClick={() => deleteMessage(message.id)}>
                      Delete Message
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
                <li className="block px-4 py-2 hover:bg-gray-100 text-black">
                  <button onClick={() => archiveMsg(message.id)}>
                    Archive message
                  </button>
                </li>
                <li
                  className="block px-4 py-2 hover:bg-gray-100 text-black"
                  onClick={() => duplicateMessage(message.id)}
                >
                  Duplicate
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
