import React from "react";

const AccountClose = () => {
  return (
    <div className="flex flex-col rounded-2xl p-4 xs:mt-2 lg:mt-0 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 xs:w-[330px] lg:w-[370px] 2xl:w-[450px] lg:h-[240px] 2xl:h-[270px]">
      <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-semibold text-white relative">
        Account Deletion
        <div className="px-2 py-2 bg-red-700 text-white xs:text-xs lg:text-normal border-gray-800 rounded-md absolute right-0 top-0 hover:bg-red-500 cursor-pointer">
          Close Account
        </div>
      </h3>
      <p className="text-white/60 xs:text-sm lg:text-normal text-start">
        If you wish to close your account press the button and we will do the
        rest.{" "}
      </p>
    </div>
  );
};

export default AccountClose;
