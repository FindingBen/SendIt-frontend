import "../css/ContactList.css";
import React, { useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";

const PurchaseHistory = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser } = useRedux();
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;
  const totalPages = Math.ceil(purchases?.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = purchases?.slice(startIndex, endIndex);
  useEffect(() => {
    //getUser();
    purchase_history();
  }, []);

  let purchase_history = async (e) => {
    try {
      let response = await axiosInstance.get(`stripe/purchases/${currentUser}`);
      if (response.status === 200) {
        setPurchases(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center mb-4 h-20 xs:mx-5 lg:mx-20 relative">
          <h3 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-white">
            Purchase history
          </h3>
          <div class="text-white flex flex-row gap-1 rounded-md hover:bg-purpleHaze smooth-hover cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 border-gray-500 border-2 p-1 lg:p-2 absolute right-0 top-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <p>Export</p>
          </div>
        </div>
        <div className="mainContainer xs:mx-5 lg:mx-20">
          <div className="items-center justify-center rounded-2xl mb-3 w-full bg-mainBlue border-gray-800 border-2 shadow-md">
            <div className="flex flex-row space-x-2 p-2">
              <button
                className={`px-2 text-xs lg:text-lg 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white font-light hover:bg-slate-500 duration-200 rounded-lg bg-darkestGray
                  `}
                //onClick={handleSortByDateCreated}
              >
                Sort by Date Created
              </button>
            </div>
            <div class="grid grid-cols-3 lg:grid-cols-5 text-xs lg:text-lg 2xl:text-xl gap-4 grid-headers text-white/50 font-normalborder-b-2 p-2 border-gray-800">
              <div>Payment ID</div>
              <div className="hidden lg:block">Ammount</div>
              {/* <div className="hidden lg:block">Package Name</div> */}
              <div className="hidden lg:block">Payment Type</div>
              <div>Date</div>
              <div>Status</div>
            </div>
            {paginatedData?.map((rowData, index) => {
              const isLastItem = index === paginatedData?.length - 1;
              const evenRow = index % 2 === 0;
              return (
                <div
                  key={rowData?.id}
                  className={`${
                    evenRow
                      ? "bg-gradient-to-b font-semibold from-lighterMainBlue to-mainBlue text-white/90"
                      : "bg-mainBlue font-semibold text-white/90"
                  } ${
                    isLastItem ? "rounded-b-2xl border-none" : ""
                  } font-light`}
                >
                  <div
                    className={`grid grid-cols-3 lg:grid-cols-5 text-xs lg:text-lg 2xl:text-xl gap-4 p-2 border-b-2 border-gray-800 ${
                      isLastItem ? "rounded-b-2xl 2xl:text-lg border-none" : ""
                    }`}
                  >
                    <div>{rowData?.payment_id}</div>
                    <div className="hidden lg:block">{rowData?.price}</div>
                    {/* <div className="hidden lg:block">
                      {rowData?.package_name}
                    </div> */}
                    <div className="hidden lg:block">{rowData?.type}</div>
                    <div>{rowData?.created_at}</div>
                    <div
                      className={`${
                        rowData?.status === "succeeded"
                          ? "bg-green-400 text-green-900"
                          : "bg-red-400 text-red-900"
                      } xs:font-bold lg:font-semibold xs:mx-5 lg:mx-5 rounded-md`}
                    >
                      {rowData?.status === "succeeded" ? "Success" : "Error"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
