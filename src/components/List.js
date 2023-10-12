import React, { useState, useEffect, useContext, memo } from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import ImgList from "./ImgList";
import TextComponent from "./TextComponent";
import ButtonComponent from "./ButtonComponent";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { config } from "../constants/Constants";
const List = ({ children, alignment, clicked, updatedList }) => {
  const [itemsElements, setItems] = useState([children]);
  const [forDelete, setForDelete] = useState([]);

  const BASE_URL = config.url.BASE_URL;
  //const BASE_URL = "https://sendit-backend-production.up.railway.app";

  useEffect(() => {
    setItems(children);
  }, [children]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={itemsElements}
        strategy={verticalListSortingStrategy}
      >
        {/* We need components that use the useSortable hook */}
        <ul className="flex flex-column" id="myList">
          {itemsElements &&
            itemsElements?.map((item, index) => (
              <SortableItem key={item.id} id={item.id} itemObject={item} />
            ))}
        </ul>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove([...items], activeIndex, overIndex);
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));
        console.log("LIST ITEMS", updatedItems);
        updatedList(updatedItems);
        return newItems;
      });
    }
  }
};

export default memo(List);
