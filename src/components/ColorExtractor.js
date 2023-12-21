import React, { useState } from "react";
import { ColorExtractor } from "react-color-extractor";

const ColorExtractorComponent = ({ imageSrc, returnColors }) => {
  return (
    <div>
      <ColorExtractor getColors={returnColors}>
        <img src={imageSrc} style={{ width: 700, height: 500 }} />
      </ColorExtractor>
    </div>
  );
};

export default ColorExtractorComponent;
