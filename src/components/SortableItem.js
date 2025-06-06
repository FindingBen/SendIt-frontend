import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import ButtonComponent from "./ButtonComponent";
import SurveyComponent from "./Survey/SurveyComponent";
import CarouselComponent from "./Carousel/CarouselComponent";
import { config } from "../constants/Constants";

export function SortableItem(props) {
  const BASE_URL = config.url.BASE_URL;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.itemObject.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  console.log(props);
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        style={{ marginBottom: "5%" }}
        id="elItem"
        key={props?.itemObject?.id}
        loading="lazy"
        className=" hover:bg-blue-300 rounded-md transition-colors"
      >
        {props.itemObject.element_type === "Img" ? (
          props.itemObject.image.startsWith("blob") ? (
            <ImgList imageUrl={props.itemObject.image} />
          ) : (
            <ImgList
              imageUrl={`${
                config.environment === "DEV"
                  ? `${BASE_URL}${props.itemObject.image}`
                  : `${props.itemObject.image}`
              }`}
            />
          )
        ) : (
          <TextComponent
            textValue={props.itemObject.text}
            alignment={props.itemObject.alignment}
          />
        )}
        {props.itemObject.element_type === "Survey" ? (
          <SurveyComponent
            questionValue={props.itemObject.survey}
            questionTypeValue={props.itemObject.question_type}
          />
        ) : (
          <></>
        )}
        {props.itemObject.element_type === "Carousel" ? (
          <CarouselComponent
            images={props.itemObject.carousel_images}
            onDelete={props.onDelete}
            deleteId={props.itemObject.id}
            context={props.itemObject.context}
          />
        ) : (
          <></>
        )}
        {props.itemObject.element_type === "Button" ? (
          <ButtonComponent
            colorValue={`#${props.itemObject.button_color}`}
            textValue={props.itemObject.button_title}
            linkValue={props.itemObject.button_link_track}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
