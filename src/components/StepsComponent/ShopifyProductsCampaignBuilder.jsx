import React, { useState, useEffect } from "react";
import ShopifyTable from "../ShopifyTable/ShopifyTable";
import PhonePreview from "../PreviewComponent/PhonePreview";
import ProductCard from "./ChildComponents/ProductCard";
import Loader from "../LoaderSkeleton/Loader";
import LoaderSkeleton from "../LoaderSkeleton/LoaderSkeleton";

const ITEMS_PER_PAGE = 5;

const ShopifyProductsCampaignBuilder = ({
  shopifyProducts,
  nextStep,
  prevStep,
  initialData,
  loading,
  productLoading,
  insightsLoading,
  getInsights,
  insights,
  updateFormData,
  search,
  apiCall,
  selected,
  onCloseCard,
  shopifyProduct,
  onProductSelect,
}) => {
  const [callFetch, setCallFetch] = useState(false);
  const [loadingStep, setLoadingStep] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((shopifyProducts?.length || 0) / ITEMS_PER_PAGE);
  const paginatedProducts = shopifyProducts?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handleApiCall = () => {
    apiCall(true);
    setCallFetch(true);
  };

  const handleNext = () => {
    updateFormData({
      shopifyProduct: { product: shopifyProduct, insights: insights },
    });
    setLoadingStep(true);
    setTimeout(() => {
      setLoadingStep(false);
      nextStep();
    }, 1000);
  };

  return (
   <section className="w-full h-screen p-4">
  <div className="grid grid-cols-2 gap-6 h-full">

    {/* LEFT SIDE — PRODUCT LIST */}
    <div className="flex flex-col gap-5 bg-[#0F1523] rounded-2xl p-6 shadow-[0_8px_25px_rgba(0,0,0,0.45)]">

      {/* HEADER + SEARCH */}
      <div className="flex items-center relative">
        <p className="text-lg text-gray-100 font-euclid">Your active products</p>

        <input
          placeholder="Search..."
          onChange={(e) => search(e.target.value)}
          className="
            absolute right-0 px-3 py-2 rounded-xl w-48
            bg-[#1A2333] text-gray-100 text-sm
            border border-transparent
            focus:outline-none focus:ring-2 focus:ring-[#3e6ff4]
            transition-all
          "
        />
      </div>

      {/* TABLE HEADERS */}
      <div className="relative w-full h-100% overflow-y-auto rounded-xl">
        {/* <div className="
          text-[11px] font-euclid grid grid-cols-4 text-gray-400 uppercase
          bg-gradient-to-r from-[#161E2D] to-[#1E2538]
          px-3 py-2 rounded-xl mb-2
        ">
          <div className="px-2">Image</div>
          <div className="px-2">Product</div>
          <div className="px-2">Qty</div>
          <div className="px-2">Action</div>
        </div> */}

        {/* PRODUCT ROWS */}
        {loading ? (
          <div className="flex justify-center">
            <Loader loading_name={"Loading products.."} />
          </div>
        ) : (
          paginatedProducts.map((product, index) => {
            const even = index % 2;
            return (
              <ShopifyTable
                key={product.id}
                product={product}
                loadingProducts={loading}
                even={even}
                onProductSelect={onProductSelect}
              />
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">

          {/* First page */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1.5 rounded-lg text-sm transition
              ${
                currentPage === 1
                  ? "bg-[#3e6ff4] text-white"
                  : "bg-[#1A2333] text-gray-300 hover:bg-[#243047]"
              }
            `}
          >
            1
          </button>

          {currentPage > 4 && <span className="px-1 text-gray-400">...</span>}

          {/* Middle pages */}
          {Array.from({ length: totalPages }, (_, idx) => idx + 1)
            .filter(
              (page) =>
                page !== 1 &&
                page !== totalPages &&
                page >= currentPage - 2 &&
                page <= currentPage + 2
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-sm transition
                  ${
                    currentPage === page
                      ? "bg-[#3e6ff4] text-white"
                      : "bg-[#1A2333] text-gray-300 hover:bg-[#243047]"
                  }
                `}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 3 && (
            <span className="px-1 text-gray-400">...</span>
          )}

          {/* Last page */}
          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1.5 rounded-lg text-sm transition
                ${
                  currentPage === totalPages
                    ? "bg-[#3e6ff4] text-white"
                    : "bg-[#1A2333] text-gray-300 hover:bg-[#243047]"
                }
              `}
            >
              {totalPages}
            </button>
          )}
        </div>
      )}
    </div>

    {/* RIGHT SIDE — INSIGHTS + PRODUCT CARD */}
    <div className="flex flex-col p-6 relative bg-[#0F1523] rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.45)]">
      <p className="text-xl text-gray-100 font-euclid">Smart insights</p>

      <div className="mt-2 text-start">
        {!selected ? (
          <span className="text-gray-300/40">
            Pick a product to get started
          </span>
        ) : loading ? (
          <Loader loading_name={"Loading insights"} />
        ) : (
          <div className="transition-all ease-in-out">
            <span className="text-gray-300/60 text-sm">
              Based on your selected product, we generated insights to help you plan content:
            </span>

            <div className="flex flex-col mt-3 gap-2">
              {insights.length > 0 ? (
                insights.map((text, idx) => (
                  <span
                    key={idx}
                    className="
                      text-gray-200 bg-[#161E2D] border-2 border-[#1F283A]
                      rounded-xl p-3 text-sm
                      shadow-[0_4px_12px_rgba(0,0,0,0.35)]
                    "
                  >
                    {text}
                  </span>
                ))
              ) : insightsLoading ? (
                <Loader loading_name={"Loading insights..."} />
              ) : (
                <button
                  onClick={() => getInsights(shopifyProduct?.id)}
                  className="
                    flex flex-row gap-2 py-2 px-3 rounded-lg
                    bg-[#1A2333] hover:bg-[#243047] text-gray-100
                    transition-all
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                  <span>Get Insights</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT CARD */}
      <div className="w-[80%] absolute bottom-[10%]">
        {selected && productLoading ? (
          <LoaderSkeleton product_card={true} div_size={3} />
        ) : selected && !productLoading ? (
          <ProductCard
            loading={productLoading}
            nextStep={handleNext}
            stepLoad={loadingStep}
            product={shopifyProduct}
            onClose={onCloseCard}
          />
        ) : (
          <button
            type="submit"
            onClick={prevStep}
            className="
              text-white mx-auto font-medium rounded-lg text-sm
              w-full sm:w-auto px-5 py-2.5 text-center
              bg-[#3e6ff4] hover:bg-[#2f5de0] transition-all
            "
          >
            Back
          </button>
        )}
      </div>
    </div>

  </div>
</section>

  );
};

export default ShopifyProductsCampaignBuilder;
