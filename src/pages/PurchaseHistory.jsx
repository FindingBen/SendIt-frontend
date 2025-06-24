import "../css/ContactList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import LoaderSkeleton from "../components/LoaderSkeleton/LoaderSkeleton";
import SmsPill from "../components/SmsPill/SmsPill";

const PurchaseHistory = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser } = useRedux();
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const rowsPerPage = 6;
  const totalPages = Math.ceil(purchases?.length / rowsPerPage);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchId, setSearchId] = useState("");
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = purchases?.slice(startIndex, endIndex);

  useEffect(() => {
    purchaseHistory();
  }, [sortOrder, searchId]);

  let purchaseHistory = async (e) => {
    try {
      let url = `stripe/purchases/${currentUser}`;
      const queryParts = [];
      if (sortOrder) queryParts.push(`sort_order=${sortOrder}`);
      if (searchId) queryParts.push(`search=${searchId}`);
      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
      }
      let response = await axiosInstance.get(url);
      if (response.status === 200) {
        setPurchases(response.data);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleSortByDate = () => {
    // Toggle between 'asc' and 'desc' when the user clicks the sort button
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    purchaseHistory(); // Call the function to fetch sorted data
  };

  const handleSearchTerm = (e) => {
    setSearchId(e.target?.value);
  };

  return (
    <div className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
          <Link to={"/welcome"}>
            <img
              src={require("../assets/noBgLogo.png")}
              width={65}
              alt="logo"
              className="mt-2"
            />
          </Link>
          <h3 className="2xl:text-3xl lg:text-2xl text-lg font-euclid font-normal text-left text-white mx-5">
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-100 border border-gray-300 rounded-lg bg-ngrokGray"
              required
            />
          </div>

          <SmsPill />
        </div>
        <div className="mx-20">
          <div className="flex flex-row items-center mb-4 h-20 xs:mx-5 md:mx-44 relative">
            <h3 className="text-lg lg:text-xl 2xl:text-2xl font-euclid text-white">
              Purchase history
            </h3>
            {/* <div class="text-white flex flex-row gap-1 rounded-md hover:bg-cyan-600 smooth-hover cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 border-gray-500 border-2 p-1 lg:p-2 absolute right-0 top-5">
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
          </div> */}
          </div>
          <div className="mainContainer xs:mx-5 lg:mx-44">
            <div className="items-center justify-center rounded-2xl mb-3 w-full bg-mainBlue border-gray-800 border-2 shadow-md">
              <div className="flex flex-row space-x-2 p-2 border-b border-gray-800">
                <button
                  className={`px-2 text-normal 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white hover:bg-ngrokBlue font-euclid duration-200 rounded-lg border-2 border-gray-800 bg-darkestGray
                  `}
                  onClick={handleSortByDate}
                >
                  Sort by Date
                </button>
                <div class="relative w-[20%]">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-gray-500 ml-2 dark:text-gray-400"
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
                  <input
                    type="search"
                    id="default-search"
                    class="block w-full p-1.5 ps-10 text-sm text-white border-2 rounded-lg focus:border-gray-700 bg-darkestGray border-gray-800"
                    placeholder="Search by payment id..."
                    required
                    value={searchId}
                    onChange={handleSearchTerm}
                  />
                </div>
              </div>
              <div class="grid grid-cols-3 lg:grid-cols-5 text-normal 2xl:text-xl gap-4 grid-headers text-white/50 font-normal border-b-2 p-2 border-gray-800">
                <div>Payment ID</div>
                <div className="hidden lg:block">Ammount</div>
                {/* <div className="hidden lg:block">Package Name</div> */}
                <div className="hidden lg:block">Payment Type</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              {!loading ? (
                <>
                  {paginatedData?.map((rowData, index) => {
                    const isLastItem = index === paginatedData?.length - 1;
                    const evenRow = index % 2 === 0;
                    return (
                      <div
                        key={rowData?.id}
                        className={`${
                          evenRow
                            ? "bg-gradient-to-b font-normal p-2 from-lighterMainBlue to-mainBlue text-white/90"
                            : "bg-mainBlue font-normal p-2 text-white/90"
                        } ${
                          isLastItem ? "rounded-b-2xl border-none" : ""
                        } font-light`}
                      >
                        <div
                          className={`grid grid-cols-3 lg:grid-cols-5 text-normal 2xl:text-xl gap-4 p-2 border-b-2 border-gray-800 ${
                            isLastItem
                              ? "rounded-b-2xl 2xl:text-normal border-none"
                              : ""
                          }`}
                        >
                          <div>{rowData?.payment_id}</div>
                          <div className="hidden lg:block">
                            {rowData?.price}
                          </div>
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
                            } xs:font-bold lg:font-semibold xs:mx-5 lg:mx-8 rounded-md`}
                          >
                            {rowData?.status === "succeeded"
                              ? "Success"
                              : "Error"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <LoaderSkeleton div_size={3} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
