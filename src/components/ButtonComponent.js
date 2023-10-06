import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
const ButtonComponent = ({ textValue, linkValue }) => {
  const [text, setText] = useState(textValue);
  const [link, setLink] = useState(linkValue);

  useEffect(() => {
    setText(textValue);
    setLink(linkValue);
  }, [textValue, linkValue]);
  console.log(link, text);
  return (
    //<Link to={link}>
    <div className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mx-10">
      <a style={{ width: "230px" }} href={`https://${link}`} target="_blank">
        <h3>{text}</h3>
      </a>
    </div>
    //</Link>
  );
};

export default ButtonComponent;
