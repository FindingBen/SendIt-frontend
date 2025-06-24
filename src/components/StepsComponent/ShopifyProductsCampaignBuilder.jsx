import React, { useState, useEffect } from "react";
import ShopifyTable from "../ShopifyTable/ShopifyTable";
import PhonePreview from "../PreviewComponent/PhonePreview";
import ProductCard from "./ChildComponents/ProductCard";
import Loader from "../LoaderSkeleton/Loader";
import LoaderSkeleton from "../LoaderSkeleton/LoaderSkeleton";

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
    <section className="max-h-screen w-full items-center justify-center">
      <div className="grid grid-cols-2 grid-rows-1 gap-4 max-h-screen">
        <div className="flex flex-col gap-5 h-screen bg-gray-900 p-4 ml-14">
          <div className="flex flex-row relative">
            <p className="text-lg text-gray-50 font-semibold text-start">
              Your active products
            </p>
            <input
              placeholder="Search..."
              onChange={(e) => search(e.target.value)}
              className="flex-1 min-h-0 rounded-lg p-1 bg-gray-700 absolute right-0 text-white"
            />
          </div>
          <ShopifyTable
            products={shopifyProducts}
            loadingProducts={loading}
            handleCall={apiCall}
            onProductSelect={onProductSelect}
          />
        </div>
        <div className="flex flex-col p-4 relative">
          <p className="text-xl text-gray-50 font-normal text-start">
            Smart insights
          </p>
          <div className="text-start">
            {!selected ? (
              <span className="text-gray-200/50">
                Pick a product to get started
              </span>
            ) : loading ? (
              <Loader loading_name={"Loading insights"} />
            ) : (
              <div className="transition ease-in-out delay-90">
                <span className="text-gray-200/50 text-start mt-2 fonte-semibold text-sm xl:text-normal">
                  Based on the product you picked we generated the following
                  insights which can help you in your content planning
                </span>
                <div className="flex flex-col mt-3 text-start">
                  {insights.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {insights.map((text, idx) => (
                        <span
                          key={idx}
                          className="text-start text-gray-200/70 border-2 border-gray-800 rounded-md p-2"
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {insightsLoading ? (
                        <Loader loading_name={"Loading insights..."} />
                      ) : (
                        <button
                          onClick={() => getInsights(shopifyProduct?.id)}
                          className="flex flex-row gap-2 py-2 px-2 bg-gray-700 rounded-md text-gray-50 hover:bg-gray-600 cursor-pointer duration-150 w-[20%]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
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
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-full absolute bottom-[20%]">
            {selected && productLoading ? (
              <div className="items-start mr-20">
                <LoaderSkeleton product_card={true} div_size={3} />
              </div>
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
                // disabled={elementContextList.length === 0} // Disable if name or type is empty
                className={`text-white mx-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
             
                bg-ngrokBlue hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300"
            `}
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
