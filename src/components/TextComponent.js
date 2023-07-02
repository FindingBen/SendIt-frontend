import React, { useState, useEffect } from "react";
import "../css/CreationMessage.css";
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

  useEffect(() => {
    setText(textValue);
    setAlign(alignment);
    getAlignmentClass(align);
  }, [textValue, alignment]);

  return (
    <div>
      <p
        dangerouslySetInnerHTML={{ __html: text }}
        style={{ textAlign: align }}
      ></p>
      <div className="image__overlay">
        <div className="image__title">Click to remove</div>
      </div>
    </div>
  );
};

export default TextComponent;
