import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import ButtonComponent from "./ButtonComponent";
import { config } from "../constants/Constants";

export function SortableItem(props) {
  // props.id
  // JavaScript
  //const BASE_URL = config.url.BASE_URL;
  const BASE_URL = "https://sendit-backend-production.up.railway.app/";

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.itemObject.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <li
        style={{ marginBottom: "5%" }}
        id="elItem"
        key={props.itemObject.id}
        loading="lazy"
        className="hover:bg-blue-300 rounded-md mx-2 transition-colors"
        //onClick={() => toDelete(item)}
      >
        {props.itemObject.element_type === "Img" ? (
          props.itemObject.image.startsWith("blob") ? (
            <ImgList imageUrl={props.itemObject.image} />
          ) : (
            <ImgList imageUrl={`${BASE_URL}${props.itemObject.image}`} />
          )
        ) : (
          <TextComponent
            textValue={props.itemObject.text}
            alignment={props.itemObject.alignment}
          />
        )}

        {props.itemObject.element_type === "Button" ? (
          <ButtonComponent
            textValue={props.itemObject.button_title}
            linkValue={props.itemObject.button_link}
          />
        ) : (
          <></>
        )}
      </li>
    </div>
  );
}
