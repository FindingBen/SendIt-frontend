import React, { useState, useEffect } from "react";

const TextComponent = ({ textValue }) => {
  const [text, setText] = useState(textValue);

  useEffect(() => {
    setText(textValue);
  }, [textValue]);

  return <h2 dangerouslySetInnerHTML={{ __html: text }}></h2>;
};

export default TextComponent;
