import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const ButtonComponent = ({ textValue, linkValue }) => {
  const [text, setText] = useState("Insert Text");
  const [link, setLink] = useState(linkValue);

  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
  }, [textValue, linkValue]);

  return (
    <a href={link}>
      <button
        type="button"
        className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        style={{ width: "295px" }}
      >
        <h3>{text}</h3>
      </button>
    </a>
  );
};

export default ButtonComponent;
