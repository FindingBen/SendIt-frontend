import React from "react";
import List from "../List";

const PreviewPanel = ({
  device,
  elementContextList,
  handleClicked,
  updateElements,
  elementState,
}) => {
  return (
    <div>
      <div
        class={`h-[470px] ${
          device === "tablet" ? "w-[350px]" : "w-[250px]"
        } relative mx-auto border-gray-800 bg-navBlue border-[14px] rounded-[2.5rem] shadow-xl`}
      >
        <div class="w-[108px] h-[10px] xl:w-[148px] xl:h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
        <div class="h-[46px] w-[3px] bg-darkGrayblack absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div class="h-[46px] w-[3px] bg-black absolute -left-[17px] top-[178px] rounded-l-lg"></div>
        <div class="h-[64px] w-[3px] bg-black absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        <div
          class={`${
            device === "tablet" ? "w-[325px]" : "w-[225px]"
          } h-[440px] rounded-[2rem] overflow-auto bg-white/80`}
        >
          <div class="mr-5 mt-2 flex justify-end space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>{" "}
          <List
            id="myList"
            className="my-scroll-list"
            children={elementContextList}
            clicked={handleClicked}
            updatedList={updateElements}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
