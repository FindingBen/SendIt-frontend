import React, { useState, useEffect } from "react";

const ButtonComponent = ({ textValue, linkValue, colorValue }) => {
  const [text, setText] = useState(textValue);
  const [link, setLink] = useState(linkValue);
  const [color, setColor] = useState(colorValue);
  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
    setColor(colorValue);
  }, [textValue, linkValue, colorValue]);
  console.log("LINK", link);
  return (
    <div
      style={{ backgroundColor: `${color}` }}
      className={`text-white font-poppins py-2 px-4 rounded-full mx-2`}
    >
      <a href={`${link}`} target="_blank">
        <h3>{text}</h3>
      </a>
    </div>
  );
};

export default ButtonComponent;
