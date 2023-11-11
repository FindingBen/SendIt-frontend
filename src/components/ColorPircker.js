import React, { useState } from "react";
import { ColorPicker } from "primereact/colorpicker";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const ColorPircker = ({ colorValue }) => {
  const [color, setColor] = useState("000000");

  colorValue(color);
  console.log(color);
  return (
    <div className="flex-1 gap-4 items-center">
      <ColorPicker
        value={color}
        onChange={(event) => setColor(event.value)}
      ></ColorPicker>
    </div>
  );
};

export default ColorPircker;
