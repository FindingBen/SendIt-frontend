import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MessageView from "../pages/MessageView";

const IFrame = ({ children }) => {
  const [ref, setRef] = useState("");

  const container = ref?.contentWindow?.document?.body;
  console.log(children);
  return (
    <iframe id="myFrame" ref={setRef}>
      {container && createPortal(children, container)}
    </iframe>
  );
};

export default IFrame;
