import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import MessageView from "../pages/MessageView";
import "../css/RootIframe.css";

const IFrame = ({ children }) => {
  const [contentRef, setContentRef] = useState(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const handleIframeLoad = () => {
      const iframeContent = contentRef?.contentWindow?.document;
      if (iframeContent) {
        const root = iframeContent.getElementById("root");
        if (root && root.parentNode) {
          root.parentNode.removeChild(root);
        }
      }
    };
    const iframeElement = contentRef?.contentWindow;
    if (iframeElement) {
      iframeElement.addEventListener("load", handleIframeLoad);
    }
    console.log(children);
    return () => {
      if (iframeElement) {
        setLoad(true);
        iframeElement.removeEventListener("load", handleIframeLoad);
      }
    };
  }, [contentRef]);
  console.log(load);
  return (
    <iframe
      id="myFrame"
      src="http://localhost:3000/message_view"
      ref={setContentRef}
    >
      {contentRef &&
        createPortal(children, contentRef?.contentWindow?.document?.body)}
    </iframe>
  );
};

export default IFrame;
