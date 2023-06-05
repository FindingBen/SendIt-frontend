import React, { useState, useEffect, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import MessageView from "../pages/MessageView";
import "../css/RootIframe.css";
import AuthContext from "../context/AuthContext";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
const IFrame = ({ children }) => {
  const [contentRef, setContentRef] = useState(null);
  const [load, setLoad] = useState(true);
  //const [user, setUser] = useState();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  // let { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    // const handleIframeLoad = () => {
    //   const iframeContent = contentRef?.contentWindow?.document;
    //   if (iframeContent) {
    //     const root = iframeContent.getElementById("root");
    //     if (root && root.parentNode) {
    //       root.parentNode.removeChild(root);
    //     }
    //   }
    //   //setLoad(false);
    // };

    const iframeElement = contentRef?.contentWindow;
    // if (iframeElement) {
    //   iframeElement.addEventListener("load", handleIframeLoad);
    // }

    const timeoutId = setTimeout(() => {
      setLoad(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      //iframeElement.removeEventListener("load", handleIframeLoad);
    };
  }, [contentRef]);
  console.log(load);
  return (
    <div id="iFrameDiv">
      {load ? (
        /* Render the loading circle or spinner */
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        /* Render the children once the iframe has finished loading */
        <iframe
          id="myFrame"
          src="http://localhost:3000/message_view"
          ref={setContentRef}
        >
          {contentRef &&
            createPortal(children, contentRef?.contentWindow?.document?.body)}
        </iframe>
      )}
    </div>
  );
};

export default IFrame;
