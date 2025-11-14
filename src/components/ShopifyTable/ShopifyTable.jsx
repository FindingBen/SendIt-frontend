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
   <div
  key={product.id}
  className={`
    flex items-center justify-between gap-4 px-4 py-3 mb-2 rounded-2xl
    transition-all duration-200 select-none cursor-pointer
    ${
      even === 0
        ? "bg-gradient-to-r from-[#121826] to-[#1A2133]"
        : "bg-[#0F1523]"
    }
    hover:shadow-[0_8px_22px_rgba(0,0,0,0.45)] hover:-translate-y-[2px]
  `}
>
  {/* IMAGE + TITLE */}
  <div className="flex items-center gap-4 min-w-0">
    <img
      src={product?.image}
      alt={product.title}
      className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-sm"
    />

    <div className="flex flex-col min-w-0 text-start">
      <span className="text-gray-100 font-medium truncate">
        {product?.title.length > 20 ? `${product.title.slice(0, 20)}...` : product?.title}
      </span>
      <span className="text-xs text-gray-400 truncate">
        {product?.vendor || product?.product_type || "Shopify Product"}
      </span>
    </div>
  </div>

  {/* QUANTITY */}
  {/* <div className="w-20 text-right text-gray-300 text-sm">
    {product.inventoryQuantity ?? product.totalInventory ?? 0}
  </div> */}

  {/* ACTION BUTTON */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onProductSelect && onProductSelect(product.id);
    }}
    className="
      px-3 py-1.5 text-sm font-medium rounded-lg text-white
      bg-gradient-to-r from-[#3e6ff4] to-[#4937BA]
      hover:brightness-110 transition-all duration-150
      shadow-[0_4px_14px_rgba(73,55,186,0.35)]
    "
  >
    Choose
  </button>
</div>

  );
};

export default ShopifyTable;
