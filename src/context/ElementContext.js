import React, { createContext, useState } from "react";

const ElementContext = createContext();

const ElementProvider = ({ children }) => {
  const [contextObject, setContextObject] = useState([]);

  const createElement = (elementData) => {
    console.log(elementData);
    setContextObject((prevObjcontext) => [...prevObjcontext, elementData]);
  };

  const deleteElement = () => {
    setContextObject([]);
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
