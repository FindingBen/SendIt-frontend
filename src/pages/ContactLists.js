import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { selectCurrentToken } from "../features/auth/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  let [contactList, setContactList] = useState([]);

  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    getContactLists();
  }, []);

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });
      if (response.status === 200) {
        setContactList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row" style={{ paddingLeft: "2.5%" }}>
            <div
              className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40", width: "95%" }}
            >
              <div className="row">
                <div className="col">
                  <h1 className="text-3xl mb-2 mt-3 text-gray-300 text-left">
                    Contact lists
                  </h1>
                </div>
                <div className="col">
                  <h1 className="text-2xl mb-2 mt-3 text-gray-200 text-right">
                    Sms credit count: 0
                  </h1>
                </div>
              </div>
            </div>
            <div>
              {contactList?.map((conList) => {
                return (
                  <div
                    key={conList.id}
                    class="w-full max-w-md p-4 bg-gray-700 border border-gray-700 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <h5 class="text-xl font-bold leading-none text-gray-300 dark:text-white">
                        {conList.list_name}
                      </h5>
                      <Link
                        to={`/contact_list/${conList.id}`}
                        class="text-sm font-medium text-gray-200 hover:underline dark:text-gray-100"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="inline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="mt-9 w-[26px] h-[26px] rounded-full fill-gray-300 border-1 border-white box-content shadow mb-3"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <p className="text-gray-300">20</p>
                    </div>

                    <div class="flow-root">
                      <ul
                        role="list"
                        class="divide-y divide-gray-200 dark:divide-gray-700"
                      >
                        {conList.contacts?.map((contacts) => {
                          return (
                            <li class="pt-3 pb-0 sm:pt-4">
                              <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                  <img
                                    class="w-8 h-8 rounded-full"
                                    src="/docs/images/people/profile-picture-5.jpg"
                                    alt="Thomas image"
                                  />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    Thomes Lean
                                  </p>
                                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                    email@windster.com
                                  </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                  $2367
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactList;
