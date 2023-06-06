import React, { useState, useEffect, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import "../css/RootIframe.css";

const IFrame = ({ children }) => {
  const [contentRef, setContentRef] = useState(null);
  const [load, setLoad] = useState(true);
  const iframeEl = document.getElementById("myFrame");

  useEffect(() => {
    const handleIframeLoad = () => {
      const iframeContent = contentRef?.contentWindow?.document;
      if (iframeContent) {
        const root = iframeContent.getElementById("root");
        if (root) {
          root.style.display = "block"; // Show the root element
          setLoad(false); // Set loading to false once content is loaded
        }
      }
    };

    const iframeElement = contentRef?.contentWindow;
    if (iframeElement) {
      iframeElement.addEventListener("load", handleIframeLoad);
    }

    return () => {
      if (iframeElement) {
        iframeElement.removeEventListener("load", handleIframeLoad);
      }
    };
  }, [contentRef]);
  console.log(load);
  return (
    <div id="iFrameDiv">
      <iframe
        title="iframe"
        id="myFrame"
        src="http://localhost:3000/message_view"
        ref={setContentRef}
      >
        {load ? (
          <div className="spinner-border" id="loader" role="status">
            <span>Loading...</span>
          </div>
        ) : (
          contentRef &&
          createPortal(children, contentRef?.contentWindow?.document?.body)
        )}
      </iframe>
    </div>
  );
};

export default IFrame;
