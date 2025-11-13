import React from "react";
import { Link } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";

const PackageInformation = () => {
  const { currentPackageState, currentUserState } = useRedux();

  const basic_package = process.env.REACT_APP_BASIC_PLAN;
  const trial_plan = process.env.REACT_APP_TRIAL_PLAN;
  const gold_package = process.env.REACT_APP_GOLD_PLAN;
  const silver_plan = process.env.REACT_APP_SILVER_PLAN;
  console.log(currentUserState);
  return (
    <div className="flex flex-col rounded-2xl bg-[#1B2233] shadow-[0_4px_16px_rgba(0,0,0,0.3)] p-6 mx-20">
  {/* Header */}
  <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4 relative">
    <h3 className="text-xl 2xl:text-2xl font-euclid text-white">Package Information</h3>
    <Link
      to={"/plans"}
      className="px-3 py-1 font-euclid bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 text-white rounded-md text-sm 2xl:text-lg transition-all"
    >
      Upgrade
    </Link>
  </div>

  {/* Content */}
  <div className="flex flex-col gap-3 text-start">
    <p className="text-white/60 text-sm lg:text-normal 2xl:text-lg">Your current package information is displayed here.</p>

    <p
      className={`text-sm lg:text-lg 2xl:text-xl font-normal ${
        currentPackageState?.package === trial_plan ? "text-white" :
        currentPackageState?.package === basic_package ? "text-white" :
        currentPackageState?.package === silver_plan ? "text-gray-400" :
        currentPackageState?.package === gold_package ? "text-yellow-500" : "text-white"
      }`}
    >
      {currentPackageState?.package}
    </p>

    <p className="text-white text-sm lg:text-normal 2xl:text-lg font-normal">
      Next billing period: {currentUserState?.scheduled_billing}
    </p>

    <p className="text-white text-sm lg:text-normal 2xl:text-lg font-normal">
      Contact list limit: {currentPackageState?.list_limit}
    </p>

    <p className="text-white text-sm lg:text-normal 2xl:text-lg font-normal">
      Recipients limit: {currentPackageState?.recipients_limit}
    </p>

    <p className="text-white text-sm lg:text-normal 2xl:text-lg font-normal">
      SMS schedule:{" "}
      <span className={
        currentPackageState?.package === gold_package || currentPackageState?.package === silver_plan
          ? "text-green-500 font-medium"
          : "text-red-500 font-medium"
      }>
        {currentPackageState?.package === gold_package || currentPackageState?.package === silver_plan ? "Yes" : "No"}
      </span>
    </p>

    <p className="text-white text-sm lg:text-normal 2xl:text-lg font-normal">
      Use of AI:{" "}
      <span className={
        currentPackageState?.package === gold_package
          ? "text-green-500 font-medium"
          : "text-red-500 font-medium"
      }>
        {currentPackageState?.package === gold_package ? "Yes" : "No"}
      </span>
    </p>
  </div>
</div>

  );
};

export default PackageInformation;
