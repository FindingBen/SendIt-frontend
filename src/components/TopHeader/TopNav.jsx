import React from "react";
import SmsPill from "../SmsPill/SmsPill";

const TopNav = () => {
  return (
    <div className="flex justify-between fixed top-0 items-center border-b-2 border-gray-800 mb-4 h-20 bg-navBlue">
      <h3 className="2xl:text-3xl lg:text-2xl text-lg font-normal text-left text-white mx-20">
        Overview
      </h3>

      <div className="flex flex-row items-center mx-20">
        <SmsPill />
      </div>
    </div>
  );
};

export default TopNav;
