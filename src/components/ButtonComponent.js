import React, { useState, useEffect } from "react";

const ButtonComponent = ({ textValue, linkValue }) => {
  const [text, setText] = useState(textValue);
  const [link, setLink] = useState(linkValue);

  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
  }, [textValue, linkValue]);

  return (
    <button type="button" class="btn btn-dark">
      <h3>{text}</h3>
    </button>
  );
};

export default ButtonComponent;
