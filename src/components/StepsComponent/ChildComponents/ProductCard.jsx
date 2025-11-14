import React from "react";
import Loader from "../../LoaderSkeleton/Loader";
const ProductCard = ({ product, onClose, loading, stepLoad, nextStep }) => {
  return (
  <div className="flex flex-col md:flex-row bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-md overflow-hidden relative w-full mx-auto">
  {/* Product Image */}
  <div className="flex-shrink-0 w-full md:w-40 h-40 md:h-auto p-2">
    <img
      className="object-cover w-full h-full rounded-xl"
      src={product?.single_image?.node?.src}
      alt={product?.title}
    />
  </div>

  {/* Product Info */}
  <div className="flex flex-col flex-1 p-4 relative">
    {/* Close Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      onClick={onClose}
      className="w-7 h-7 text-white absolute top-3 right-3 cursor-pointer hover:bg-gray-700 p-1 rounded-lg transition duration-150"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    {/* Title with truncation */}
    <h5 className="text-white text-lg font-semibold mb-2 truncate text-start" title={product?.title}>
      {product?.title.length > 20 ? `${product.title.slice(0, 20)}...` : product?.title}
    </h5>

    {/* Meta Info */}
    <div className="flex flex-col gap-2 text-gray-300 text-sm">
      <div className="flex items-center gap-1">
        <span>Store published:</span>
        <span className="text-gray-100">
          {product?.createdAt ? product.createdAt.slice(0, 10) : "-"}
        </span>
      </div>
    </div>

    {/* Continue Button */}
    <div className="mt-auto flex justify-end">
      {stepLoad ? (
        <Loader loading_name="Next step..." />
      ) : (
        <button
          onClick={nextStep}
          className="bg-ngrokBlue hover:bg-ngrokBlue/70 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
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
