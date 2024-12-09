import React from "react";
import { Link } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";

const PackageInformation = () => {
  const { currentPackageState } = useRedux();

  const basic_package = process.env.BASIC_PLAN;
  const trial_plan = process.env.TRIAL_PLAN;
  const gold_package = process.env.GOLD_PLAN;
  const silver_plan = process.env.SILVER_PLAN;

  return (
    <div className="flex flex-col rounded-2xl p-4 xs:mt-2 md:mt-0 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 lg:w-[400px] xs:w-[330px] 2xl:w-[450px] h-[290px] lg:h-[290px] 2xl:h-[360px]">
      <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-semibold text-white relative">
        Package Information
        {/* <Link
          to={`/plans`}
          className="px-2 py-2 flex flex-row gap-1 bg-green-700 text-white xs:text-xs lg:text-normal border-gray-800 rounded-md absolute right-0 top-0 hover:bg-green-500 cursor-pointer"
        >
          <p className="lg:text-normal xs:text-xs 2xl:text-normal">Upgrade</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="lg:size-4 2xl:size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
            />
          </svg>
        </Link> */}
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
          } xs:text-sm lg:text-lg 2xl:text-xl font-bold`}
        >
          {currentPackageState?.package}
        </p>
        <p className="text-white xs:text-sm lg:text-normal 2xl:text-lg font-semibold">
          Contact list limit: {currentPackageState?.list_limit}
        </p>
        <p className="text-white xs:text-sm lg:text-normal 2xl:text-lg font-semibold">
          Recipients limit: {currentPackageState?.recipients_limit}
        </p>
        <p className="text-white flex flex-row gap-2 xs:text-sm lg:text-normal 2xl:text-lg font-semibold">
          Use of AI: <p className="text-red-500">No</p>
        </p>
        <p className="text-white flex flex-row gap-2 xs:text-sm lg:text-normal 2xl:text-lg font-semibold">
          Sms scheduling: <p className="text-red-500">No</p>
        </p>
      </div>
    </div>
  );
};

export default PackageInformation;
