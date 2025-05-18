import React, { useState, useEffect } from "react";
import ShopifyTable from "../ShopifyTable/ShopifyTable";
import PhonePreview from "../PreviewComponent/PhonePreview";
const ShopifyProductsCampaignBuilder = ({
  shopifyProducts,
  nextStep,
  prevStep,
  initialData,
  updateFormData,
  apiCall,
}) => {
  return (
    <section className="max-h-screen w-full items-center justify-center">
      <div className="grid grid-cols-2 grid-rows-1 gap-4 max-h-screen">
        <div className="flex flex-col gap-5 max-h-screen bg-gray-900 p-4">
          <div className="flex flex-row relative">
            <p className="text-lg text-gray-50 font-semibold text-start">
              Your active products
            </p>
            <input
              placeholder="Search..."
              className="flex-1 min-h-0 rounded-lg p-1 bg-gray-700 absolute right-0"
            />
          </div>
          <ShopifyTable products={shopifyProducts} />
        </div>
        <div>2</div>
      </div>
    </section>
  );
};

export default ShopifyProductsCampaignBuilder;
