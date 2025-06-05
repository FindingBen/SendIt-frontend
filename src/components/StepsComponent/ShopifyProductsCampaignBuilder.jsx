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
  getInsights,
  insights,
  updateFormData,
  apiCall,
  selected,
  onCloseCard,
  shopifyProduct,
  onProductSelect,
}) => {
  const [callFetch, setCallFetch] = useState(false);
  const [prevData, setPrevData] = useState({ ...initialData });

  const handleApiCall = () => {
    apiCall(true);
    setCallFetch(true);
  };

  const handleNext = () => {
    updateFormData({
      shopifyProduct: { product: shopifyProduct, insights: insights },
    });
    nextStep();
  };

  return (
    <section className="max-h-screen w-full items-center justify-center">
      <div className="grid grid-cols-2 grid-rows-1 gap-4 max-h-screen">
        <div className="flex flex-col gap-5 h-screen bg-gray-900 p-4">
          <div className="flex flex-row relative">
            <p className="text-lg text-gray-50 font-semibold text-start">
              Your active products
            </p>
            <input
              placeholder="Search..."
              className="flex-1 min-h-0 rounded-lg p-1 bg-gray-700 absolute right-0"
            />
          </div>
          {callFetch ? (
            loading ? (
              <Loader loading_name="Loading products..." />
            ) : (
              <ShopifyTable
                products={shopifyProducts}
                onProductSelect={onProductSelect}
              />
            )
          ) : (
            <button
              onClick={handleApiCall}
              className="px-2 py-1 mx-auto flex flex-row gap-2 rounded-md bg-green-800 text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4 my-auto"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span className="text-gray-50">Fetch your products</span>
            </button>
          )}
        </div>
        <div className="flex flex-col p-4 relative">
          <p className="text-xl text-gray-50 font-semibold text-start">
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
                product={shopifyProduct}
                onClose={onCloseCard}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyProductsCampaignBuilder;
