import React, { useState, useEffect, useContext, memo } from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import "../css/List.css";
import ButtonComponent from "./ButtonComponent";
import { ElementContext } from "../context/ElementContext";
const List = ({ children, alignment, clicked }) => {
  const [items, setItems] = useState([children]);
  const [forDelete, setForDelete] = useState([]);
  //const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://stingray-app-9825w.ondigitalocean.app";
  //const { deleteElement, contextObject } = useContext(ElementContext);
  useEffect(() => {
    setItems(children);
  }, [children, items]);

  const toDelete = (item) => {
    setItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    //deleteElement(item);
    clicked(item);
  };

  return (
    <MDBListGroup
      className="my-scroll-list"
      style={{ minWidthL: "22rem" }}
      light
      id="myList"
    >
      {items &&
        items?.map((item, index) => (
          <li
            id="elItem"
            key={item.id}
            className="list-group-light"
            //className="hover:bg-blue-300"
            //onClick={() => toDelete(item)}
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
          </li>
        ))}
    </MDBListGroup>
  );
};

export default memo(List);
