import React, { useState, useEffect, useContext } from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import ButtonComponent from "./ButtonComponent";
import { ElementContext } from "../context/ElementContext";
const List = ({ children, alignment, clicked }) => {
  const [items, setItems] = useState([children]);
  const [forDelete, setForDelete] = useState([]);
  const BASE_URL = "http://127.0.0.1:8000";
  //const { deleteElement, contextObject } = useContext(ElementContext);
  useEffect(() => {
    setItems(children);
  }, [children]);

  const toDelete = (item) => {
    setItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    //deleteElement(item);
    clicked(item);
  };

  return (
    <MDBListGroup
      className="mt-4"
      style={{ minWidthL: "22rem" }}
      light
      id="myList"
    >
      {items &&
        items?.map((item, index) => (
          <MDBListGroupItem
            id="elItem"
            key={item.id}
            className="hover:bg-blue-300"
            onClick={() => toDelete(item)}
          >
            {item.element_type === "Img" ? (
              item.image.startsWith("blob") ? (
                <ImgList imageUrl={item.image} />
              ) : (
                <ImgList imageUrl={`${BASE_URL}${item.image}`} />
              )
            ) : (
              <TextComponent textValue={item.text} alignment={item.alignment} />
            )}

            {item.element_type === "Button" ? (
              <ButtonComponent textValue={item.button_title} />
            ) : (
              <></>
            )}
          </MDBListGroupItem>
        ))}
    </MDBListGroup>
  );
};

export default List;
