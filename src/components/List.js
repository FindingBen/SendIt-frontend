import React, { useState, useEffect, useContext, memo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import useAxiosInstance from "../../src/utils/axiosInstance";

const List = ({ children, alignment, clicked, updatedList }) => {
  const [itemsElements, setItems] = useState([children]);
  const [forDelete, setForDelete] = useState([]);
  const axiosInstance = useAxiosInstance();
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

  console.log(itemsElements);

  const toDelete = (id) => {
    console.log(id);
    const updatedItems = itemsElements.filter((item) => item.id !== id);

    // Update the state with the filtered items
    setItems(updatedItems);

    // Call the updatedList function with the updated items
    updatedList(updatedItems);

    // Make the API request to delete the item
    try {
      axiosInstance
        .delete(`/api/delete_element/${id}/`)
        .then((response) => {
          if (response.status === 200) {
            console.log("Success");
          }
        })
        .catch((error) => {
          console.log("Error deleting elements:", error);
        });
    } catch (error) {
      console.log("Error making the API request:", error);
    }
  };
  console.log(itemsElements);
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
              <li key={item.id} className="relative rounded-md mx-2">
                <SortableItem key={item.id} id={item.id} itemObject={item} />
                <span
                  className="absolute top-1 right-0 cursor-pointer hover:bg-slate-400 rounded-full "
                  onClick={() => toDelete(item.id)}
                >
                  <p className="text-white">X</p>
                </span>
              </li>
            ))}
        </ul>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    try {
      //if (active.id !== over.id) {
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
      // }
    } catch (e) {
      console.log(e);
    }
  }
};

export default memo(List);
