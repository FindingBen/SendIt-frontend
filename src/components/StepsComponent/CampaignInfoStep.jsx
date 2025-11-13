import React, { useState } from "react";
import Loader from "../LoaderSkeleton/Loader";

const CampaignInfoStep = ({
  nextStep,
  updateFormData,
  initialData,
  tokenType,
  shopifyCampaignTrigger = () => {},
}) => {
  const [campaignInfo, setCampaignInfo] = useState({
    name: "",
    campaignContent: "",
    type: "",
    ...initialData,
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
      type: prev.type === type ? "" : type,
    }));
  };

  const handleShopifySelect = (campaign) => {
    shopifyCampaignTrigger(campaign);
    setCampaignInfo((prev) => ({
      ...prev,
      campaignContent: prev.campaignContent === campaign ? "" : campaign,
    }));
  };

  return (
    <section className="flex flex-col min-h-screen bg-[#0A0E1A] text-gray-200 p-4">
  <div className="flex-1 flex justify-center items-start mt-16 px-4">
    <div className="w-full max-w-md bg-[#111827] border-2 border-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-white text-2xl font-euclid font-normal mb-6 text-left border-b border-gray-800 pb-3">
        Create Campaign
      </h3>

      <form className="flex flex-col gap-5">
        {/* Campaign Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-white text-lg font-medium">
            Campaign name
          </label>
          <input
            type="text"
            name="name"
            value={campaignInfo.name}
            onChange={handleChange}
            id="name"
            placeholder="Hot source sale"
            required
            className="bg-gray-50 text-gray-900 text-sm rounded-xl p-2 w-full border focus:ring-0 focus:border-indigo-300"
          />
        </div>

        {/* Campaign Content */}
        {tokenType && (
          <div className="flex flex-col gap-2">
            <label className="text-white text-lg font-medium">Campaign content</label>
            <ul className="flex w-full border border-gray-200 rounded-lg overflow-hidden bg-white text-sm font-medium">
              {["Shopify", "Custom"].map((content) => (
                <li
                  key={content}
                  className={`flex-1 cursor-pointer py-2 text-center transition ${
                    campaignInfo.campaignContent === content
                      ? "bg-ngrokBlue text-white"
                      : "text-gray-900"
                  }`}
                  onClick={() => handleShopifySelect(content)}
                >
                  {content === "Shopify" ? "Shopify Product" : "Custom Campaign"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Campaign Type */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-lg font-medium">Campaign type</label>
          <ul className="flex w-full border border-gray-200 rounded-lg overflow-hidden bg-white text-sm font-medium">
            {["Promotional", "Notification"].map((type) => (
              <li
                key={type}
                className={`flex-1 cursor-pointer py-2 text-center transition ${
                  campaignInfo.type === type ? "bg-ngrokBlue text-white" : "text-gray-900"
                }`}
                onClick={() => handleTypeSelect(type)}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>

        {/* Next Button / Loader */}
        {loading ? (
          <div className="flex justify-center mt-4">
            <Loader loading_name={"Next step..."} />
          </div>
        ) : (
          <button
            type="submit"
            onClick={handleNext}
            disabled={!campaignInfo.name || !campaignInfo.type}
            className={`text-white font-medium rounded-xl w-full py-2.5 mt-4 ${
              !campaignInfo.name || !campaignInfo.type
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-ngrokBlue hover:bg-ngrokBlue/70 focus:ring-4 focus:outline-none focus:ring-blue-300"
            }`}
          >
            Next
          </button>
        )}
      </form>
    </div>
  </div>
</section>

  );
};

export default CampaignInfoStep;
