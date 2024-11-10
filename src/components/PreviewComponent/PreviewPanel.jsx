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
        class={`h-[445px] lg:h-[520px] 2xl:h-[650px] w-[350px] 2xl:w-[450px] rounded-[1rem] overflow-auto bg-white/80`}
      >
        <br></br>

        <List
          id="myList"
          className="my-scroll-list"
          children={elementContextList}
          clicked={handleClicked}
          updatedList={updateElements}
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
