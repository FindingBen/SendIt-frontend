import React from "react";
import List from "../List";
import ViewList from "../ViewList";

const ArchivePreviewPanel = ({ elements }) => {
  return (
    <div
      class={`h-[430px] w-[250px]
     relative mx-auto border-gray-800 bg-gray-800 border-[5px]`}
    >
      <div
        class={`w-[245px]
         h-[420px] overflow-auto bg-white/80`}
      >
        <List
          isArchive={true}
          children={elements}
          style={{ width: "100%" }}
        ></List>
      </div>
    </div>
  );
};

export default ArchivePreviewPanel;
