import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Billings = ({ purchases }) => {
  const copyPurchaseId = (id, index) => {
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
  return (
    <div className="flex-initial rounded-lg p-4 xl:p-10 mt-4 bg-darkestGray">
      <h3 class="text-2xl text-left font-extralight text-white/50">
        Purchase history
      </h3>

      <p class="text-left text-sm text-gray-500 dark:text-gray-400">
        Copy the purchase id and include it in your inquire in case of any
        questions{" "}
      </p>

      {purchases.length > 0 ? (
        <ul className="flex flex-col items-left mt-3 max-h-80 text-white/50 overflow-y-scroll">
          {purchases?.map((purchase, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  ease: [0, 0.41, 0.1, 1.01],
                }}
                className="relative text-base text-left text-gray-300 bg-slate-800 mb-2 rounded-md p-3 hover:bg-slate-800/50 cursor-pointer"
                key={purchase.id}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 xl:w-5 xl:h-5 absolute right-1 top-1 cursor-pointer"
                  onClick={() => copyPurchaseId(purchase.payment_id, index)}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>

                <div className="ml-1 flex flex-row">
                  <p className="font-bold">Product name:</p>
                  <p className="ml-1"> {purchase.package_name}</p>
                </div>
                <div className="ml-1 flex flex-row">
                  <p className="font-bold">Price:</p>
                  <p className="ml-1"> {purchase.price + "€"}</p>
                </div>
                <div className="ml-1 flex flex-row">
                  <p className="font-bold">Purchase id:</p>
                  <p className="ml-1"> {purchase.payment_id}</p>
                </div>
              </motion.div>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center mt-4 text-grayWhite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.0"
            stroke="currentColor"
            class="w-20 h-20 opacity-75"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          <p className="text-sm mt-3 text-grayWhite">No purchases yet..</p>
        </div>
      )}
    </div>
  );
};

export default Billings;
