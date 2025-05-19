import React from "react";

const ShopifyTable = ({ products, onProductSelect }) => {
  console.log(onProductSelect);
  return (
    <div class="relative w-full h-[50%] lg:h-[65%] overflow-y-auto sm:rounded-lg">
      <div class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <div class="text-xs grid grid-cols-4 text-gray-700 uppercase bg-gray-700 dark:text-gray-400">
          <div class="px-6 py-1">Image</div>
          <div class="px-4 py-1">Product</div>
          <div class="px-4 py-1">Qty</div>
          <div class="px-4 py-1">Action</div>
        </div>
        <div>
          {products?.map((product, index) => {
            const evenRow = index % 2 === 0;
            return (
              <div
                key={product.id}
                className={`grid grid-cols-4 ${
                  evenRow ? "bg-gray-900" : "bg-gray-800"
                }`}
              >
                <div class="p-2">
                  <img
                    src={product?.image?.node?.src}
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
                    onClick={() =>
                      onProductSelect && onProductSelect(product.id)
                    }
                    class="font-medium px-2 py-1 text-cyan-700 hover:underline"
                  >
                    Choose
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopifyTable;
