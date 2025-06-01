import React, { useState, useEffect, useContext, memo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import useAxiosInstance from "../../src/utils/axiosInstance";
import { motion } from "framer-motion-3d";

const List = ({ children, alignment, clicked, updatedList }) => {
  const [itemsElements, setItems] = useState(
    Array.isArray(children) ? children : children ? [children] : []
  );
  const axiosInstance = useAxiosInstance();
  useEffect(() => {
    const safeChildren = Array.isArray(children)
      ? children
      : children
      ? [children]
      : [];
    setItems(safeChildren);
    if (JSON.stringify(itemsElements) !== JSON.stringify(safeChildren)) {
      setItems(safeChildren);

      // When children change, compute initial order values based on index
      if (safeChildren.length > 0) {
        const initialItems = safeChildren?.map((item, index) => ({
          ...item,
          order: index,
        }));
        updatedList(initialItems);
      }
    }
  }, [children]);

  const toDelete = (id) => {
    console.log("ID", id);
    const updatedItems = itemsElements?.filter((item) => item?.id !== id);

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
  console.log("LIST", itemsElements);
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={itemsElements}
        strategy={verticalListSortingStrategy}
      >
        {/* We need components that use the useSortable hook */}
        <ul className="flex flex-column" id="myList">
          {itemsElements &&
            itemsElements
              .filter(Boolean) // <-- filter out null/undefined
              .map((item, index) => (
                <div
                  // initial={{ opacity: 0, scale: 0.5 }}
                  // animate={{ opacity: 1, scale: 1 }}
                  // transition={{
                  //   duration: 0.3,
                  //   delay: 0.1,
                  //   ease: [0, 0.41, 0.1, 1.01],
                  // }}
                  key={item?.id}
                  className="relative rounded-md mx-2"
                >
                  <SortableItem
                    key={item?.id}
                    id={item?.id}
                    itemObject={item}
                    onDelete={toDelete}
                  />
                  
                    <span
                      className="absolute top-1 right-0 cursor-pointer hover:bg-slate-400 rounded-full "
                      onClick={() => toDelete(item?.id)}
                    >
                      <p className="text-white bg-red-600 rounded-lg w-6 h-6">
                        X
                      </p>
                    </span>

                </div>
              ))}
        </ul>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!active || !over) return;

    try {
      setItems((items) => {
        // Filter out null/undefined items before using findIndex
        const filteredItems = items.filter(Boolean);
        const activeIndex = filteredItems.findIndex(
          (item) => item.id === active.id
        );
        const overIndex = filteredItems.findIndex(
          (item) => item.id === over.id
        );

        // If either index is not found, do nothing
        if (activeIndex === -1 || overIndex === -1) return filteredItems;

        const newItems = arrayMove([...filteredItems], activeIndex, overIndex);
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        updatedList(updatedItems);
        return newItems;
      });
    } catch (e) {
      console.log(e);
    }
  }
};

export default memo(List);
