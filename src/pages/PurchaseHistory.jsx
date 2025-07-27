import "../css/ContactList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import LoaderSkeleton from "../components/LoaderSkeleton/LoaderSkeleton";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";

const PurchaseHistory = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser } = useRedux();
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [shopifyBillingData, setShopifyBillingData] = useState([]);
  const rowsPerPage = 6;
  const totalPages = Math.ceil(purchases?.length / rowsPerPage);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchId, setSearchId] = useState("");
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = purchases?.slice(startIndex, endIndex);
  // let shopifyBillingData = [
  //   {
  //     charge_id: "1234567890",
  //     plan_name: "Gold Package",
  //     price: "49.99",
  //     billing_date: "2025-07-01",
  //     status: "paid",
  //   },
  //   {
  //     charge_id: "2345678901",
  //     plan_name: "Silver Package",
  //     price: "29.99",
  //     billing_date: "2025-07-15",
  //     status: "active",
  //   },
  //   {
  //     charge_id: "3456789012",
  //     plan_name: "Basic Package",
  //     price: "9.99",
  //     billing_date: "2025-07-20",
  //     status: "pending",
  //   },
  // ];

  useEffect(() => {
    purchaseHistory();
    billingsHistory();
  }, [sortOrder, searchId]);

  let billingsHistory = async (e) => {
    try {
      let response = await axiosInstance.get(`/stripe/user_billings/`);
      console.log(response);
      if (response.status === 200) {
        setShopifyBillingData(response.data.billings);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
  console.log(shopifyBillingData);
  return (
    <div className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center border-b-2 border-gray-800 h-16 bg-navBlue sticky top-0 z-10">
          <Search />
          <SmsPill />
        </div>

        <div className="mx-20">
          {/* PURCHASE HISTORY HEADER */}
          <div className="flex flex-row items-center h-20 xs:mx-5 md:mx-44 relative">
            <h3 className="text-lg lg:text-xl 2xl:text-2xl font-euclid text-white">
              Purchase history
            </h3>
          </div>

          <div className="mainContainer xs:ml-5 lg:ml-44">
            {/* PURCHASE HISTORY TABLE */}
            <div className="items-center justify-center rounded-lg w-full bg-mainBlue border-gray-800 border-2 shadow-md">
              <div className="flex flex-row space-x-2 p-2 border-b border-gray-800">
                <button
                  className="px-2 text-normal 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white hover:bg-ngrokBlue font-euclid duration-200 rounded-lg border-2 border-gray-800 bg-darkestGray"
                  onClick={handleSortByDate}
                >
                  Sort by Date
                </button>
                <div className="relative w-[20%]">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 ml-2 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-1.5 ps-10 text-sm text-white border-2 rounded-lg focus:border-gray-700 bg-darkestGray border-gray-800"
                    placeholder="Search by payment id..."
                    value={searchId}
                    onChange={handleSearchTerm}
                  />
                </div>
              </div>

              {/* TABLE HEADERS */}
              <div className="grid grid-cols-3 lg:grid-cols-5 text-normal 2xl:text-xl gap-4 grid-headers text-white/50 font-normal border-b-2 p-2 border-gray-800">
                <div>Payment ID</div>
                <div className="hidden lg:block">Ammount</div>
                <div className="hidden lg:block">Payment Type</div>
                <div>Date</div>
                <div>Status</div>
              </div>

              {/* TABLE ROWS */}
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
                          isLastItem ? "rounded-b-lg border-none" : ""
                        } font-light`}
                      >
                        <div
                          className={`grid grid-cols-3 lg:grid-cols-5 text-normal 2xl:text-xl gap-4 p-2 border-b-2 border-gray-800 ${
                            isLastItem
                              ? "rounded-b-lg 2xl:text-normal border-none"
                              : ""
                          }`}
                        >
                          <div>{rowData?.payment_id}</div>
                          <div className="hidden lg:block">
                            {rowData?.price}
                          </div>
                          <div className="hidden lg:block">{rowData?.type}</div>
                          <div>{rowData?.created_at}</div>
                          <div
                            className={`${
                              rowData?.status === "succeeded"
                                ? "bg-green-400 text-green-900"
                                : "bg-red-400 text-red-900"
                            } font-medium text-sm xs:mx-5 lg:mx-8 rounded-lg`}
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

            {/* --- SHOPIFY BILLING TABLE --- */}
            {shopifyBillingData?.length > 0 && (
              <div className="items-center justify-center rounded-lg w-full mt-10 bg-mainBlue border-gray-800 border-2 shadow-md">
                <div className="flex flex-row items-center h-20 xs:mx-5 relative">
                  <div className="flex flex-col gap-2 items-start">
                    <h3 className="text-lg lg:text-xl 2xl:text-2xl font-euclid text-white">
                      Shopify Billing Cycles
                    </h3>
                    <span className="text-gray-300/50">
                      If you need a full list of billing cycles contact us.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-4 text-normal 2xl:text-xl gap-4 grid-headers text-white/50 font-normal border-b-2 p-2 border-gray-800">
                  <div>Charge ID</div>
                  <div className="hidden lg:block">Plan Name</div>
                  <div className="hidden lg:block">Price</div>
                  <div>Billing Date</div>
                </div>

                {shopifyBillingData.map((billing, index) => {
                  const isLast = index === shopifyBillingData.length - 1;
                  const evenRow = index % 2 === 0;
                  return (
                    <div
                      key={billing.shopify_charge_id}
                      className={`${
                        evenRow
                          ? "bg-gradient-to-b font-normal p-2 from-lighterMainBlue to-mainBlue text-white/90"
                          : "bg-mainBlue font-normal p-2 text-white/90"
                      } ${isLast ? "rounded-b-lg border-none" : ""} font-light`}
                    >
                      <div
                        className={`grid grid-cols-3 lg:grid-cols-4 text-normal 2xl:text-xl gap-4 p-2 border-b-2 border-gray-800 ${
                          isLast
                            ? "rounded-b-lg 2xl:text-normal border-none"
                            : ""
                        }`}
                      >
                        <div>{billing.shopify_charge_id}</div>
                        <div className="hidden lg:block">
                          {billing?.billing_plane}
                        </div>
                        <div className="hidden lg:block">
                          {billing.billing_amount} {"$"}
                        </div>
                        <div>{billing.billing_date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
