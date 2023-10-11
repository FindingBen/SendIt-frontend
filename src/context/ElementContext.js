import React, { createContext, useState } from "react";

const ElementContext = createContext();

const ElementProvider = ({ children }) => {
  const [contextObject, setContextObject] = useState([]);

  const createElement = (elementData) => {
    setContextObject((prevObjcontext) => [...prevObjcontext, elementData]);
  };

  const deleteElement = (item) => {
    console.log(item);
    setContextObject((prevObjcontext) =>
      prevObjcontext.filter((prevItem) => prevItem !== item)
    );
  };

  return (
    <ElementContext.Provider
      value={{ contextObject, createElement, deleteElement }}
    >
      {children}
    </ElementContext.Provider>
  );
};

export { ElementContext, ElementProvider };
