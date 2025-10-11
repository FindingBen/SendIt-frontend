import React, { useState, useEffect } from "react";
import { ColorPicker } from "primereact/colorpicker";
import ErrorBoundary from "./ErrorBoundary";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const ColorPircker = ({ colorValue }) => {
  const [color, setColor] = useState("ffffff");



  useEffect(() => {
    colorValue(color);
  }, [color, colorValue]);

  return (
    <ErrorBoundary>
      <div className="flex-1 gap-4 items-center">
        <ColorPicker
          inline
          value={color}
          onChange={(event) => setColor(event.value)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ColorPircker;