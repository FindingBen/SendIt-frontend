import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { selectCurrentToken } from "../features/auth/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  let [contactList, setContactList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    getContactLists();
    setIsLoading(true);
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
        setIsLoading(false);
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
            {!isLoading ? (
              <div>
                {contactList?.map((conList) => {
                  return (
                    <div
                      key={conList.id}
                      class="w-full mb-3 max-w-md p-4 bg-gray-700 border border-gray-700 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
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
                      <div className="row">
                        <div className="col">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-[26px] h-[26px] rounded-full fill-gray-300 border-1 border-white box-content shadow mb-3"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </div>
                        <div className="col" style={{ marginRight: "76%" }}>
                          <p className="text-gray-300">
                            {conList.contact_lenght}
                          </p>
                        </div>
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
            ) : (
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactList;
