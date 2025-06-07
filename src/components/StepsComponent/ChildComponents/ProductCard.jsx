import React from "react";
import Loader from "../../LoaderSkeleton/Loader";
const ProductCard = ({ product, onClose, loading, stepLoad, nextStep }) => {
  return (
    <div class="flex flex-col relative items-center border-2 border-gray-800 rounded-lg shadow-sm md:flex-row md:max-w-xl bg-gray-800">
      <div className="p-2">
        <img
          class="object-cover w-full h-32 md:w-40 rounded-md"
          src={product?.single_image?.node["src"]}
          alt=""
        />
      </div>
      <div class="flex flex-col justify-between p-2 leading-normal">
        <h5 class="mb-2 text-lg font-semibold tracking-tight text-white">
          {product?.title}
        </h5>
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            {/* <div className="flex flex-row gap-2">
            <snap className="text-gray-50/50">Price:{product.price}</snap>
          </div> */}
            <div className="flex flex-row gap-2">
              <snap className="text-gray-50/50">
                Store published:
                <span className="text-gray-50 ml-2">
                  {product["createdAt"]
                    ? product["createdAt"].slice(0, 10)
                    : ""}
                </span>
              </snap>
            </div>
            {/* <div className="flex flex-row gap-2">
              <snap className="text-gray-50/50">Updated:</snap>
            </div> */}
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          onClick={onClose}
          class="size-6 text-white absolute right-1 top-1 hover:cursor-pointer hover:bg-slate-400 rounded-lg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <div className="absolute bottom-1 right-2">
          {stepLoad ? (
            <Loader loading_name={"Next step..."} />
          ) : (
            <button
              onClick={nextStep}
              className="py-2 px-2 text-gray-100 font-medium absolute bottom-1 right-2 bg-slate-700 rounded-lg hover:cursor-pointer hover:bg-slate-400"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
