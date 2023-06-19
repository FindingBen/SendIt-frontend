import React, { useState, useEffect } from "react";

const TextComponent = ({ textValue, alignment }) => {
  const [text, setText] = useState(textValue);
  const [align, setAlign] = useState(alignment);

  const getAlignmentClass = () => {
    if (align && align.includes("ql-align-center")) {
      return "center";
    } else if (align && align.includes("ql-align-right")) {
      return "right";
    } else {
      return "left";
    }
  };
  console.log(align);
  useEffect(() => {
    setText(textValue);
    setAlign(alignment);
    getAlignmentClass(align);
  }, [textValue, alignment]);

  return (
    <p
      dangerouslySetInnerHTML={{ __html: text }}
      style={{ textAlign: align }}
    ></p>
  );
};

export default TextComponent;
