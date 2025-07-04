import React, { useState } from "react";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div class="relative">
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
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      )}
      <input
        type="search"
        id="default-search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="block w-full p-1 ps-8 text-sm text-gray-100 border-2 border-gray-700 rounded-lg bg-ngrokGray"
        required
      />
    </div>
  );
};

export default Search;
