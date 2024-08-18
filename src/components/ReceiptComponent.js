import React, { useState, useEffect } from "react";

const ReceiptComponent = ({ purchase_obj }) => {
  const [purchase, setPurchase] = useState(purchase_obj);

  const copyPurchaseId = (id) => {
    const input = document.createElement("input");
    input.value = id;
    document.body.appendChild(input);

    // Select the text inside the input element
    input.select();

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);
  };

  useEffect(() => {
    setPurchase(purchase_obj);
  }, [purchase_obj]);

  return (
    <div className="flex flex-col p-2 bg-mainBlue border-2 border-gray-800 rounded-xl w-72 h-80">
      <div className="flex flex-col">
        <div className="flex flex-row p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-14 h-14 text-green-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>

          <div className="flex flex-col text-justify ml-2">
            <p className="text-normal text-white">
              Paid <span className="font-bold">{purchase.price} Kr.</span>
            </p>
            <p className="text-normal text-white">
              Date: <span className="font-bold">{purchase.created_at}</span>
            </p>
          </div>
        </div>
        <div className="text-start p-2">
          <p className="text-normal text-white">
            Item: <span className="font-bold">{purchase.package_name}</span>
          </p>
          <p className="text-normal text-white">
            payment_method:{" "}
            <span className="font-bold">{purchase.payment_method}</span>
          </p>
          <p className="text-normal text-white">
            Order ID: <span className="font-bold">{purchase.payment_id}</span>
          </p>
        </div>
      </div>
      <div
        onClick={() => copyPurchaseId(purchase.payment_id)}
        className="px-2 py-2 bg-purpleHaze text-white font-normal rounded-2xl mx-5 mt-2 cursor-pointer"
      >
        Copy ID
      </div>
    </div>
  );
};

export default ReceiptComponent;
