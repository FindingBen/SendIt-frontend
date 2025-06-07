import React, { useState } from "react";
import Loader from "../LoaderSkeleton/Loader";

const CampaignInfoStep = ({
  nextStep,
  updateFormData,
  initialData,
  tokenType,
}) => {
  const [campaignInfo, setCampaignInfo] = useState({
    name: "",
    campaignContent: "",
    type: "",
    ...initialData, // Initialize with existing data if available
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaignInfo({ ...campaignInfo, [name]: value });
  };
  const handleNext = (e) => {
    e.preventDefault();
    setLoading(true);
    updateFormData({ campaignInfo: campaignInfo });
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 1200); // 1.2 seconds for smoother UX
  };

  const handleTypeSelect = (type) => {
    setCampaignInfo((prev) => ({
      ...prev,
      type: prev.type === type ? "" : type, // Toggle the type
    }));
  };

  const handleShopifySelect = (campaign) => {
    setCampaignInfo((prev) => ({
      ...prev,
      campaignContent: prev.campaignContent === campaign ? "" : campaign, // Toggle the type
    }));
  };

  return (
    <div>
      <form class="max-w-sm mx-auto">
        <div class="mb-5 mt-16 items-start">
          <label for="name" class="mb-2 text-lg font-medium text-white">
            Campaign name
          </label>
          <input
            type="text"
            name="name"
            value={campaignInfo.name}
            onChange={handleChange}
            id="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400"
            placeholder="Hot source sale"
            required
          />
        </div>
        {tokenType ? (
          <div class="mb-5">
            <label class="mb-2 text-lg font-medium text-white">
              Campaing content
            </label>
            <ul class="items-center w-full text-sm font-medium  bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <li
                className={`w-full border-b transition delay-75 sm:border-b-0 sm:border-r  ${
                  campaignInfo.campaignContent === "Shopify"
                    ? "bg-cyan-600 border-l rounded-md"
                    : "text-gray-900"
                }`}
              >
                <div className="flex items-center ps-3">
                  <input
                    id="campaign-content-shopify"
                    type="radio"
                    value="Shopify"
                    name="list-radio-shopify"
                    checked={campaignInfo.campaignContent === "Shopify"}
                    onChange={() => handleShopifySelect("Shopify")}
                    className="hidden"
                  />
                  <label
                    htmlFor="campaign-content-shopify"
                    className="w-full py-3 ms-2 text-sm font-medium cursor-pointer"
                  >
                    Shopify Product
                  </label>
                </div>
              </li>
              <li
                className={`w-full border-b border-gray-200 sm:border-b-0 transition delay-75 ${
                  campaignInfo.campaignContent === "Custom"
                    ? "bg-cyan-600 border-r rounded-md text-white"
                    : "text-gray-900"
                }`}
              >
                <div className="flex items-center ps-3">
                  <input
                    id="campaign-content-custom"
                    type="radio"
                    value="Custom"
                    name="list-radio-shopify"
                    checked={campaignInfo.campaignContent === "Custom"}
                    onChange={() => handleShopifySelect("Custom")}
                    className="hidden"
                  />
                  <label
                    htmlFor="campaign-content-custom"
                    className="w-full py-3 ms-2 text-sm font-medium cursor-pointer"
                  >
                    Custom Campaign
                  </label>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
        <div class="mb-5">
          <label class="mb-2 text-lg font-medium text-white">
            Campaing type
          </label>
          <ul class="items-center w-full text-sm font-medium  bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li
              className={`w-full border-b transition delay-75 sm:border-b-0  ${
                campaignInfo.type === "Promotional"
                  ? "bg-cyan-600 border-l rounded-md"
                  : "text-gray-900"
              }`}
            >
              <div className="flex items-center ps-3">
                <input
                  id="horizontal-list-radio-license"
                  type="radio"
                  value="Promotional"
                  name="list-radio"
                  checked={campaignInfo.type === "Promotional"}
                  onChange={() => handleTypeSelect("Promotional")}
                  className="hidden"
                />
                <label
                  htmlFor="horizontal-list-radio-license"
                  className="w-full py-3 ms-2 text-sm font-medium cursor-pointer"
                >
                  Promotional
                </label>
              </div>
            </li>
            <li
              className={`w-full border-b border-gray-200 sm:border-b-0 transition delay-75 sm:border-r ${
                campaignInfo.type === "Notification"
                  ? "bg-cyan-600 border-r rounded-md text-white"
                  : "text-gray-900"
              }`}
            >
              <div className="flex items-center ps-3">
                <input
                  id="horizontal-list-radio-id"
                  type="radio"
                  value="Notification"
                  name="list-radio"
                  checked={campaignInfo.type === "Notification"}
                  onChange={() => handleTypeSelect("Notification")}
                  className="hidden"
                />
                <label
                  htmlFor="horizontal-list-radio-id"
                  className="w-full py-3 ms-2 text-sm font-medium cursor-pointer"
                >
                  Notification
                </label>
              </div>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader loading_name={"Next step..."} />
          </div>
        ) : (
          <button
            type="submit"
            onClick={handleNext}
            disabled={!campaignInfo.name || !campaignInfo.type} // Disable if name or type is empty
            className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
              !campaignInfo.name || !campaignInfo.type
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300"
            }`}
          >
            Next
          </button>
        )}
      </form>
    </div>
  );
};

export default CampaignInfoStep;
