import React from "react";
import { BeatLoading, BounceLoading } from "respinner";

const LoaderComponent = ({ className = "" }) => {
  return (
    <BounceLoading gap={5} fill="#3e6ff4" size={4} className={`${className}`} />
  );
};

export default LoaderComponent;
