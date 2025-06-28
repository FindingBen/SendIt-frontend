import React, { useState } from "react";
import Loader from "../LoaderSkeleton/Loader";

const ITEMS_PER_PAGE = 5;

const ShopifyTable = ({
  product,
  onProductSelect,
  even,
  handleCall,
  loadingProducts,
}) => {
  return (
    <div class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <div>
        <div
          key={product.id}
          className={`grid grid-cols-4 ${
            even === 0 ? "bg-gray-800" : "bg-gray-900"
          }`}
        >
          <div class="p-2">
            <img
              src={product?.image}
              class="w-10 md:w-20 h-20 rounded-md"
              alt="alt-title"
            />
          </div>
          <div class="px-6 py-3 font-semibold text-gray-900 dark:text-white">
            {product.title}
          </div>
          <div class="px-6 py-3">{product.inventoryQuantity}</div>

          <div class="px-6 py-3">
            <button
              onClick={() => onProductSelect && onProductSelect(product.id)}
              class="font-medium px-2 py-1 bg-ngrokBlue hover:bg-blue-500 cursor-pointer rounded-lg text-white font-euclid"
            >
              Choose
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyTable;
