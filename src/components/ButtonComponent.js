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
      <button type="button" class="btn btn-dark" style={{ width: "295px" }}>
        <h3>{text}</h3>
      </button>
    </a>
  );
};

export default ButtonComponent;
