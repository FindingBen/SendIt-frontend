import React, { useState } from "react";
import { Link } from "react-router-dom";
import SmsPill from "../components/SmsPill/SmsPill";

const CancelPayment = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section className="min-h-screen flex-d w-full items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
        <Link to={"/welcome"}>
          <img
            src={require("../assets/noBgLogo.png")}
            width={65}
            alt="logo"
            className="mt-2"
          />
        </Link>
        <h3 className="2xl:text-3xl lg:text-2xl text-lg font-normal text-left font-euclid text-white mx-5">
          Sendperplane
        </h3>

        <div class="relative">
          {searchValue === "" && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          )}
          <input
            type="search"
            id="default-search"
            class="block w-full p-2 ps-10 text-sm text-gray-100 border-2 border-gray-700 rounded-lg bg-ngrokGray"
            required
          />
        </div>

        <SmsPill />
      </div>
      <div className="flex-1 flex flex-col mb-4 h-20 items-center">
        <div className="flex-1 px-2 sm:px-0 xl:px-0 mx-20">
          <h2 className="mt-10 mb-5 text-center text-white text-3xl font-euclid">
            Payment has been cancelled <br></br>
          </h2>
        </div>

        <Link
          to={"/plans"}
          className="text-white hover:text-blue-500 cursor-pointer"
        >
          <div className="flex flex-row gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>{" "}
            Back to Packages
          </div>
        </Link>
      </div>
    </section>
  );
};

export default CancelPayment;
