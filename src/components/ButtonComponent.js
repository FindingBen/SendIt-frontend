import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
const ButtonComponent = ({ textValue, linkValue }) => {
  const [text, setText] = useState("Insert Text");
  const [link, setLink] = useState(linkValue);

  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
  }, [textValue, linkValue]);

  return (
    //<Link to={link}>
    //<div className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded">
    <a style={{ width: "230px" }} href={`${linkValue}`}>
      <h3>{text}</h3>
    </a>
    //</div>
    //</Link>
  );
};

export default ButtonComponent;
