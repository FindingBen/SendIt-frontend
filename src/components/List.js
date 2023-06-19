import React, { useState, useEffect } from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import ButtonComponent from "./ButtonComponent";
const List = ({ children, alignment }) => {
  const [items, setItems] = useState([children]);

  const BASE_URL = "http://127.0.0.1:8000";
  useEffect(() => {
    setItems(children);
  }, [children]);
  items?.map((item) => {
    console.log(`"${item.alignment}"`);
  });
  return (
    <MDBListGroup style={{ minWidthL: "22rem" }} light id="myList">
      {items &&
        items?.map((item, index) => (
          <MDBListGroupItem id="elItem" key={index}>
            {item.element_type === "Img" ? (
              <ImgList
                imageUrl={`${item.image}`}
                //alt="Italian Trulli"
              ></ImgList>
            ) : (
              <TextComponent
                textValue={item.text}
                alignment={item.alignment}
              ></TextComponent>
            )}

            {item.element_type === "Button" ? (
              <ButtonComponent textValue={item.button_title}></ButtonComponent>
            ) : (
              <></>
            )}
          </MDBListGroupItem>
        ))}
    </MDBListGroup>
  );
};

export default List;
