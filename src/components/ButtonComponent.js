import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const ButtonComponent = ({ textValue, linkValue }) => {
  const [text, setText] = useState(textValue);
  const [link, setLink] = useState(linkValue);

  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
  }, [textValue, linkValue]);
  console.log(link);
  return (
    <a href={link}>
      <button type="button" class="btn btn-dark">
        <h3>{text}</h3>
      </button>
    </a>
  );
};

export default ButtonComponent;
