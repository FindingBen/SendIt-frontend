import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";

const Search = () => {
  const { currentUser } = useRedux();
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const pages = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Home", path: "/home" },
    // { name: "Campaigns", path: "/campaign_stats/" },
    { name: "Contact Lists", path: "/contact_lists" },
    { name: "Plans", path: "/plans/" },
    { name: "Account", path: `/account_settings/${currentUser}` },
    { name: "Archives", path: "/archive/" },
    // Add more pages as needed
  ];

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (path) => {
    setSearchValue("");
    setShowDropdown(false);
    navigate(path);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filteredPages.length > 0) {
      handleSelect(filteredPages[0].path);
    }
  };

  return (
    <>
      <Link to={"/home"} className="ml-10">
        <img
          src={require("../../assets/noBgLogo.png")}
          width={65}
          alt="logo"
          className="mt-2"
        />
      </Link>
      <h3 className="2xl:text-3xl lg:text-xl text-lg font-normal text-left text-white mx-5">
        Sendperplane
      </h3>
      <form className="relative" onSubmit={handleSubmit} autoComplete="off">
        {searchValue === "" && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
            <svg
              className="w-6 h-3 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        )}
        <input
          type="search"
          id="default-search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setShowDropdown(true);
          }}
          className="block w-full p-1 ps-8 text-sm text-gray-100 border-2 border-gray-700 rounded-lg bg-ngrokGray"
          required
          autoComplete="off"
        />
        {showDropdown && searchValue && filteredPages.length > 0 && (
          <div className="absolute z-10 w-full bg-[#23253a] border border-gray-700 rounded mt-1">
            {filteredPages.map((page) => (
              <div
                key={page.path}
                className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-white"
                onClick={() => handleSelect(page.path)}
              >
                {page.name}
              </div>
            ))}
          </div>
        )}
      </form>
    </>
  );
};

export default Search;
