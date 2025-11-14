import React from "react";
import List from "../List";

const PreviewPanel = ({
  device,
  newLook,
  elementContextList,
  handleClicked,
  updateElements,
  elementState
}) => {
  return (
    <div className="flex justify-center">
      <div
        className={`
          relative w-[350px] 2xl:w-[450px] 
          h-[445px] lg:h-${newLook ? "[500px]" : "[450px]"} 2xl:h-[650px] 
          bg-white/80 backdrop-blur-sm 
          rounded-2xl overflow-auto shadow-lg border border-gray-300
        `}
      >
        <div className="p-4">
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
