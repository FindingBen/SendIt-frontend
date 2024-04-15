import React from "react";
import { Link } from "react-router-dom";

export const MessageCard = ({
  message,
  duplicateMessage,
  toggleAnalyticsDrawer,
  deleteMessage,
  archiveMsg,
}) => {
  return (
    <div className={`grid grid-cols-5 gap-3 mb-3 h-10 items-center`}>
      <div className="text-white/90">{message.message_name}</div>
      <div className="text-white/50">{message.created_at}</div>
      <div>
        {message.status === "Draft" ? (
          <p>Unavailabe</p>
        ) : message.status === "Scheduled" ? (
          <p>Unavailabe</p>
        ) : (
          <Link
            type="button"
            className="hover:bg-sky-300 rounded"
            onClick={() => toggleAnalyticsDrawer(message.id)}
            //to={`/analytics/${message.id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="lg:w-6 lg:h-6 w-4 h-4"
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
          <span class="text-xs font-medium leading-none text-center text-white bg-gradient-to-r from-sky-500 to-sky-800 rounded-lg px-3 lg:px-4 lg:py-1">
            Draft
          </span>
        ) : message.status === "Scheduled" ? (
          <span class="text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-lg animate-pulse px-3 lg:px-4 lg:py-1">
            Scheduled
          </span>
        ) : (
          <span class="text-xs font-medium leading-none text-center text-white bg-gradient-to-r from-green-500 to-green-800 rounded-lg px-3 lg:px-4 lg:py-1">
            Sent
          </span>
        )}
      </div>

      {/* <div className="flex flex-row items-center justify-center gap-4 border-l border-white">
        <div>
          <Link
            className="hover:bg-sky-300 rounded"
            type="button"
            to={`/edit_message/${message.id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="0.6"
              stroke="currentColor"
              class="lg:w-6 lg:h-6 w-4 h-4 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Link>
        </div>

        <Link
          type="button"
          className="hover:bg-sky-300 rounded"
          onClick={() => duplicateMessage(message.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="0.6"
            stroke="currentColor"
            class="lg:w-6 lg:h-6 w-4 h-4 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
            />
          </svg>
        </Link>
        <Link
          type="button"
          className="hover:bg-sky-300 rounded"
          onClick={() => deleteMessage(message.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="0.5"
            stroke="currentColor"
            className="lg:w-6 lg:h-6 w-4 h-4 fill-red-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </Link>
      </div> */}
      <div>
        <div
          id="dropdown"
          class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <Link
              to={`/sms_editor/${message.id}`}
              className="block px-4 py-2 hover:bg-gray-100 text-black"
            >
              Send message
            </Link>

            <Link
              onClick={() => archiveMsg(message.id)}
              className="block px-4 py-2 hover:bg-gray-100 text-black"
            >
              Archive message
            </Link>
          </ul>
        </div>
        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
