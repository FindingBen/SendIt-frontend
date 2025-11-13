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
  const { currentUser, currentShopifyToken } = useRedux();
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

  return (
    <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
  {/* Sticky Top Bar */}
  <div className="flex items-center h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-20 border-b border-[#1C2437]/40 px-8">
    <Search />
    <SmsPill />
  </div>

  {/* Main Content */}
  <div className="flex flex-col w-full lg:flex-row mt-6 ml-20 px-44 space-y-6 lg:space-y-0">
    <div className="flex-1 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-wide text-gray-100">
          Billing History
        </h2>
        {/* Example actions if needed */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSortByDate}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] shadow-md text-white hover:opacity-90 transition-all"
          >
            Sort by Date
          </button>
        </div>
      </div>

      {/* Purchase History Table */}
      {currentShopifyToken === null && (
        <div className="bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] overflow-x-auto">
          {/* Search Filter */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800 space-x-4">
            <div className="relative w-1/5">
              <input
                type="search"
                placeholder="Search by Payment ID..."
                value={searchId}
                onChange={handleSearchTerm}
                className="w-full px-3 py-2 ps-10 rounded-lg bg-[#111827] border border-gray-800 text-white focus:outline-none"
              />
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 px-4 py-2 text-gray-300 font-medium border-b border-gray-700">
            <div>Payment ID</div>
            <div className="hidden lg:block">Amount</div>
            <div className="hidden lg:block">Payment Type</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {/* Table Rows */}
          {!loading ? (
            paginatedData?.map((rowData, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === paginatedData.length - 1;
              return (
                <div
                  key={rowData?.id}
                  className={`grid grid-cols-3 lg:grid-cols-5 gap-4 px-4 py-3 border-b border-gray-700 bg-[#111827] ${isLast ? "rounded-b-2xl border-none" : ""} hover:bg-[#3E6FF4]/10 transition-all`}

                >
                  <div>{rowData?.payment_id}</div>
                  <div className="hidden lg:block">{rowData?.price}</div>
                  <div className="hidden lg:block">{rowData?.type}</div>
                  <div>{rowData?.created_at}</div>
                  <div
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      rowData?.status === "succeeded"
                        ? "bg-green-400 text-green-900"
                        : "bg-red-400 text-red-900"
                    }`}
                  >
                    {rowData?.status === "succeeded" ? "Success" : "Error"}
                  </div>
                </div>
              );
            })
          ) : (
            <LoaderSkeleton div_size={3} />
          )}
        </div>
      )}

      {/* Shopify Billing Table */}
      {shopifyBillingData?.length > 0 && (
        <div className="bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] overflow-x-auto mt-6">
          <div className="flex flex-col text-start p-4 border-b border-gray-800 gap-1">
            <h3 className="text-xl font-semibold text-white">Shopify Billing Cycles</h3>
            <span className="text-gray-300/50 text-sm">
              If you need a full list of billing cycles contact us.
            </span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-2 text-gray-300 font-medium border-b border-gray-700">
            <div>Charge ID</div>
            <div className="hidden lg:block">Plan Name</div>
            <div className="hidden lg:block">Price</div>
            <div>Billing Date</div>
          </div>

          {/* Table Rows */}
          {shopifyBillingData.map((billing, index) => {
            const isEven = index % 2 === 0;
            const isLast = index === shopifyBillingData.length - 1;
            return (
              <div
                key={billing.shopify_charge_id}
                className={`grid grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-3 border-b border-gray-700 bg-[#111827] ${isLast ? "rounded-b-2xl border-none" : ""} hover:bg-[#3E6FF4]/10 transition-all`}
              >
                <div>{billing.shopify_charge_id}</div>
                <div className="hidden lg:block">{billing?.billing_plane}</div>
                <div className="hidden lg:block">{billing.billing_amount} $</div>
                <div>{billing.billing_date}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
</section>

  );
};

export default PurchaseHistory;
