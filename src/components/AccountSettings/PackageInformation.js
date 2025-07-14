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
    <div className="flex flex-col rounded-2xl p-4 mx-20 relative">
      <h3 class="flex flex-row xs:text-normal border-b-2 border-gray-800 lg:text-xl 2xl:text-2xl text-left mb-4 font-normal text-white relative">
        <span className="text-xl 2xl:text-2xl">Package Information</span>
        <Link
          to={"/plans"}
          className="px-1 py-1 font-euclid absolute -right-0 -top-2 bg-ngrokBlue hover:bg-blue-500 text-white rounded-md text-sm 2xl:text-lg"
        >
          Upgrade
        </Link>
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
        <p className="text-white xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Sms schedule:{" "}
          <span
            className={
              currentPackageState?.package === gold_package ||
              currentPackageState?.package === silver_plan
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {currentPackageState?.package === gold_package ||
            currentPackageState?.package === silver_plan
              ? "Yes"
              : "No"}
          </span>
        </p>

        <p className="text-white flex flex-row gap-2 xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Use of AI:{" "}
          <span
            className={
              currentPackageState?.package === gold_package
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {currentPackageState?.package === gold_package ? "Yes" : "No"}
          </span>
        </p>
        {/* <p className="text-white flex flex-row gap-2 xs:text-sm lg:text-normal 2xl:text-lg font-normal">
          Sms scheduling: <p className="text-red-500">No</p>
        </p> */}
      </div>
    </div>
  );
};

export default PackageInformation;
