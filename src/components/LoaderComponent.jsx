import React from "react";
import { BeatLoading, BounceLoading } from "respinner";

const LoaderComponent = ({ className = "" }) => {
  return (
    <BounceLoading gap={5} fill="#2d889d" size={4} className={`${className}`} />
  );
};

export default LoaderComponent;
