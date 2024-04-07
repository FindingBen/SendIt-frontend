import React from "react";
import List from "../List";
import ViewList from "../ViewList";

const ArchivePreviewPanel = ({ elements }) => {
  return (
    <div
      class={`h-[450px] w-[250px]
     relative mx-auto border-black bg-darkGray border-[14px] rounded-[2.5rem] shadow-xl`}
    >
      <div
        class={`w-[225px]
         h-[420px] rounded-[2rem] overflow-auto bg-white/80`}
      >
        <ViewList children={elements} style={{ width: "100%" }}></ViewList>
      </div>
    </div>
  );
};

export default ArchivePreviewPanel;
