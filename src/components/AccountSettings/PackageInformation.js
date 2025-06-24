import React from "react";
import { Link } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";

const PackageInformation = () => {
  const { currentPackageState } = useRedux();

  const basic_package = process.env.REACT_APP_BASIC_PLAN;
  const trial_plan = process.env.REACT_APP_TRIAL_PLAN;
  const gold_package = process.env.REACT_APP_GOLD_PLAN;
  const silver_plan = process.env.REACT_APP_SILVER_PLAN;

  return (
    <div className="flex flex-col rounded-2xl p-4 xs:mt-2 md:mt-0 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 lg:w-[400px] xs:w-[330px] 2xl:w-[450px] h-[290px] lg:h-[290px] 2xl:h-[360px]">
      <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-normal text-white relative">
        Package Information
      </h3>
      <div className="flex flex-col gap-2 items-start">
        <p className="text-white/60 xs:text-sm lg:text-normal text-start">
          Your current package information is displayed here.
        </p>
        <p
          className={`${
            currentPackageState?.package === trial_plan
              ? "text-white"
              : currentPackageState?.package === basic_package
              ? "text-white"
              : currentPackageState?.package === silver_plan
              ? "text-gray-400"
              : currentPackageState?.package === gold_package
              ? "text-yellow-500"
              : "" // Default case
          } xs:text-sm lg:text-lg 2xl:text-xl font-normal`}
        >
          {currentPackageState?.package}
        </p>
        <p className="text-white xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Contact list limit: {currentPackageState?.list_limit}
        </p>
        <p className="text-white xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Recipients limit: {currentPackageState?.recipients_limit}
        </p>
        <p className="text-white flex flex-row gap-2 xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Use of AI: <span className="text-red-500">No</span>
        </p>
        {/* <p className="text-white flex flex-row gap-2 xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Sms scheduling: <p className="text-red-500">No</p>
        </p> */}
      </div>
    </div>
  );
};

export default PackageInformation;
