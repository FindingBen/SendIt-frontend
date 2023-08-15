import React, { useEffect, useState } from "react";

import runReport from "../utils/googleAnalyticsApi";

const AnalyticsPage = () => {
  const [views, setViews] = useState();

  useEffect(() => {
    //runReport();
  }, []);

  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row text-gray-300" style={{ paddingLeft: "2.5%" }}>
            <div
              className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40", width: "95%" }}
            >
              <div className="row">
                <div className="col">
                  <h1 className="text-3xl mb-2 mt-3 text-gray-300 text-left">
                    Sms analytics
                  </h1>
                </div>
                <div className="col">
                  <h1 className="text-2xl mb-2 mt-3 text-gray-200 text-right">
                    Sms credit count: 0
                  </h1>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-300 dark:bg-gray-800 text-gray-600 rounded-lg shadow-lg h-full mb-3"
              style={{ width: "30%", paddingBottom: "2.5%" }}
            >
              <div x-data="{ tooltips: false }" class="pt-6 px-6 relative">
                Users online right now{" "}
                <span class="ltr:float-right rtl:float-left w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse"></span>
              </div>
              <div class="flex flex-row justify-between p-6">
                <div class="self-center relative text-center">
                  <h2 className="text-3xl">Total sent</h2>
                </div>
                <h2 class="self-center text-3xl">602</h2>
              </div>
              <div class="px-6">
                <div class="relative">
                  <div className="row">
                    <div className="col">
                      <h2 className="text-left hover:text-indigo-500">
                        Scroll thru rate
                      </h2>
                    </div>
                    <div className="col">
                      <h2 className="text-right">90%</h2>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="row mt-3">
                    <div className="col">
                      <h2 className="text-left hover:text-indigo-500">
                        Open rate
                      </h2>
                    </div>
                    <div className="col">
                      <h2 className="text-right">90%</h2>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="row mt-3">
                    <div className="col">
                      <h2 className="text-left hover:text-indigo-500">
                        Click rate
                      </h2>
                    </div>
                    <div className="col">
                      <h2 className="text-right">90%</h2>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              </div>
            </div>
            <div className="col" style={{ paddingLeft: "2%" }}>
              <div
                class="block rounded-lg bg-gray-300 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
                style={{ width: "26%" }}
              >
                <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                  Successfull
                </h5>
                <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                  TBA
                </p>
              </div>
              <div
                class="block mt-2 rounded-lg bg-gray-300 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
                style={{ width: "20%" }}
              >
                <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                  Failed
                </h5>
                <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                  TBA
                </p>
              </div>
            </div>
          </div>
          <div className="row" style={{ paddingLeft: "2.5%" }}>
            <div className="col" style={{ paddingLeft: "0%" }}>
              <div
                class="bg-gray-400 rounded-lg p-4 md:p-6"
                style={{ width: "50%", height: "100%" }}
              >
                <div class="flex justify-between">
                  <div>
                    <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                      32.4k
                    </h5>
                    <p class="text-base font-normal text-gray-500 dark:text-gray-400">
                      Users this week
                    </p>
                  </div>
                  <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                    12%
                    <svg
                      class="w-3 h-3 ml-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13V1m0 0L1 5m4-4 4 4"
                      />
                    </svg>
                  </div>
                </div>
                <div id="area-chart"></div>
                <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                  <div class="flex justify-between items-center pt-5">
                    <button
                      id="dropdownDefaultButton"
                      data-dropdown-toggle="lastDaysdropdown"
                      data-dropdown-placement="bottom"
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                      type="button"
                    >
                      Last 7 days
                      <svg
                        class="w-2.5 m-2.5 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>

                    <div
                      id="lastDaysdropdown"
                      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        class="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Yesterday
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Today
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Last 7 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Last 30 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Last 90 days
                          </a>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="#"
                      class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
                    >
                      Users Report
                      <svg
                        class="w-2.5 h-2.5 ml-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
