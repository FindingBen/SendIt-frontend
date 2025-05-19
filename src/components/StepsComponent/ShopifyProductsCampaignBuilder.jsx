import React, { useState, useEffect } from "react";
import ShopifyTable from "../ShopifyTable/ShopifyTable";
import PhonePreview from "../PreviewComponent/PhonePreview";
import ProductCard from "./ChildComponents/ProductCard";

const ShopifyProductsCampaignBuilder = ({
  shopifyProducts,
  nextStep,
  prevStep,
  initialData,
  updateFormData,
  apiCall,
  selected,
  onCloseCard,
  shopifyProduct,
  onProductSelect,
}) => {
  const [callFetch, setCallFetch] = useState(false);
  const [cardComponent, setCardComponent] = useState(false);

  const handleApiCall = () => {
    apiCall(true);
    setCallFetch(true);
  };
  console.log("call", shopifyProduct);
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
            <ShopifyTable
              products={shopifyProducts}
              onProductSelect={onProductSelect}
            />
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
          <span className="text-gray-200/50 text-start mt-2 fonte-semibold text-sm xl:text-normal">
            Based on the product you picked we generated the following insights
            which can help you in your content planning
          </span>
          <div className="flex flex-col mt-3 text-start">
            <span className="text-lg text-gray-300">
              1. Inventory & Urgency Signals
            </span>
          </div>
          <div className="w-full absolute bottom-[20%] left-10">
            {selected && (
              <ProductCard product={shopifyProduct} onClose={onCloseCard} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyProductsCampaignBuilder;
