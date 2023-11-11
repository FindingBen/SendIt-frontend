import React, { useState, useEffect } from "react";

const ButtonComponent = ({ textValue, linkValue, colorValue }) => {
  const [text, setText] = useState(textValue);
  const [link, setLink] = useState(linkValue);
  const [color, setColor] = useState(colorValue);
  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
  }, [textValue, linkValue]);

  useEffect(() => {
    setColor(colorValue);
  }, [colorValue, color]);

  console.log(color);
  return (
    <div
      style={{ backgroundColor: `#${color}` }}
      className={`text-white font-poppins py-2 px-4 rounded-full mx-2`}
    >
      <a href={`https://${link}`} target="_blank">
        <h3>{text}</h3>
      </a>
    </div>
  );
};

export default ButtonComponent;
