import React, { useState, useEffect, useContext, memo } from "react";
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



  useEffect(() => {
    setItems(children);
    if (JSON.stringify(itemsElements) !== JSON.stringify(children)) {
      setItems(children);

      // When children change, compute initial order values based on index
      if (children && children.length > 0) {
        const initialItems = children.map((item, index) => ({
          ...item,
          order: index,
        }));
        updatedList(initialItems);
      }
    }
  }, [children, itemsElements]);


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
      
        updatedList(updatedItems);
        return newItems;
      });
    }
  }
};

export default memo(List);
