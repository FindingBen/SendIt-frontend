import React, { useState } from "react";
import { Link } from "react-router-dom";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";

const CancelPayment = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section className="min-h-screen flex-d w-full items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-2 h-16 bg-navBlue sticky top-0 z-10">
        <Search />

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
