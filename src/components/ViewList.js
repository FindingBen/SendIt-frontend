import React, { useState, useEffect, useContext, memo } from "react";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import ButtonComponent from "./ButtonComponent";
import { config } from "../constants/Constants";

const ViewList = ({ children }) => {
  const BASE_URL = config.url.BASE_URL;
  const [itemsElements, setItems] = useState([children]);

  useEffect(() => {
    setItems(children);
  }, [children]);

  return (
    <ul>
      {itemsElements &&
        itemsElements?.map((item, index) => (
          <li
            style={{ marginBottom: "5%" }}
            id="elItem"
            key={item.id}
            loading="lazy"
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
              <ButtonComponent
                textValue={item.button_title}
                linkValue={item.button_link}
              />
            ) : (
              <></>
            )}
          </li>
        ))}
    </ul>
  );
};

export default ViewList;
