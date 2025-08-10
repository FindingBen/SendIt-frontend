import React, { useState, useEffect } from "react";

const ReceiptComponent = ({ purchase_obj, packageObj }) => {
  const [purchase, setPurchase] = useState(purchase_obj);
  const createdAt = new Date(purchase?.created * 1000).toLocaleString();

  const copyPurchaseId = (id) => {
    navigator.clipboard.writeText(id);
  };

  useEffect(() => {
    setPurchase(purchase_obj);
  }, [purchase_obj]);

  return (
    <div className="flex flex-col p-6 bg-darkBlue rounded-2xl shadow-lg border border-ngrokGray w-80">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
        <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 
              3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 
              1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 
              3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 
              0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 
              1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 
              12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 
              1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">
            Paid:{" "}
            <span className="text-ngrokBlue">
              {purchase?.plan.amount / 100} $
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Date: <span className="text-white">{createdAt}</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="py-4 space-y-2 text-sm">
        <p className="text-gray-300">
          Item:{" "}
          <span className="font-medium text-white">
            {packageObj?.package_plan}
          </span>
        </p>
        <p className="text-gray-300">
          Payment Method:{" "}
          <span className="font-medium text-white">
            {purchase?.payment_settings.payment_method_types[0]}
          </span>
        </p>
        <p className="text-gray-300 truncate">
          Order ID:{" "}
          <span className="font-medium text-white">{purchase?.id}</span>
        </p>
      </div>

      {/* Copy Button */}
      <button
        onClick={() => copyPurchaseId(purchase?.id)}
        className="mt-auto bg-ngrokBlue hover:bg-blue-500 transition-colors text-white font-medium py-2 px-4 rounded-lg shadow"
      >
        Copy ID
      </button>
    </div>
  );
};

export default ReceiptComponent;
