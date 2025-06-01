import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { ElementContext } from "../../context/ElementContext";
import { useRedux } from "../../constants/reduxImports";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import CarouselComponent from "./CarouselComponent";
import { CSS } from "@dnd-kit/utilities";

function SortableImage({ id, src, idx, onRemove, onUpload }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center relative w-24 h-24 bg-gray-800 rounded-md border-2 border-gray-700 flex-shrink-0"
    >
      {src ? (
        <>
          <img
            src={src}
            alt={`Shopify product ${idx + 1}`}
            className="object-cover w-full h-full rounded"
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <span className="text-gray-500 text-xs">Upload</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUpload(idx, e.target.files[0]);
              }
            }}
          />
        </label>
      )}
    </div>
  );
}

const MAX_IMAGES = 5;

const Carousel = ({
  setComponentState,
  listEl,
  contextList,
  elementList,
  productImages,
}) => {
  const { currentUser } = useRedux();
  const { createElement } = useContext(ElementContext);
  const [isCreated, setIsCreated] = useState(listEl);
  const container = document.getElementById("myList");
  const [isMounted, setIsMounted] = useState(true);

  const { v4: uuidv4 } = require("uuid");

  const imageSrcArray = Array.isArray(productImages)
    ? productImages.map((img) => img?.node?.src).filter(Boolean)
    : [];
  const [images, setImages] = useState(
    Array.isArray(imageSrcArray) ? imageSrcArray.slice(0, MAX_IMAGES) : []
  );
  useEffect(() => {
    setImages(
      Array.from({ length: MAX_IMAGES }).map((_, idx) => imageSrcArray[idx])
    );
  }, [productImages]);
  useEffect(() => {
    try {
      const lastListItem = container?.lastChild;

      if (!isCreated) {
        ReactDOM.render(
          <CarouselComponent images={images.filter(Boolean)} />,
          lastListItem
        );
      } else {
        ReactDOM.render(
          <CarouselComponent images={images.filter(Boolean)} />,
          container
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [container, images]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      try {
        if (isMounted && container) {
          const lastListItem = container?.lastChild;

          if (!isCreated) {
            ReactDOM.render(<></>, lastListItem);
          } else {
            ReactDOM.render(<li></li>, container);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      const oldIndex = images.findIndex(
        (_, idx) => `img-${idx}` === active?.id
      );
      const newIndex = images.findIndex((_, idx) => `img-${idx}` === over?.id);
      setImages((imgs) => arrayMove(imgs, oldIndex, newIndex));
    }
  }

  const addCarouselObjContext = () => {
    const imagesToSend = images.filter(Boolean);
    const dataText = {
      id: Math.floor(Math.random() * 1000000),
      unique_button_id: uuidv4(),
      carousel_images: [imagesToSend],
      element_type: "Carousel",
      users: currentUser,
      order: 0,
      context: true,
    };
    //this creates a context data
    createElement(dataText);
    //this adds data to context el list
    contextList((prevElement) => [...prevElement, dataText]);
    //this makes sure that newly created data is displayed together with old elements
    elementList((prevElement) => [...prevElement, dataText]);
    //stepList((prevElement) => [...prevElement, dataText]);
  };

  const handleRemoveImage = (idx) => {
    setImages((imgs) => {
      const newImgs = [...imgs];
      newImgs[idx] = null;
      return newImgs;
    });
  };

  const handleUploadImage = (idx, file) => {
    const reader = new FileReader();
    const previewUrl = URL.createObjectURL(file);
    // const displayUrl = previewUrl.replace(/^blob:/, "");
    reader.onload = (e) => {
      setImages((imgs) => {
        const newImgs = [...imgs];
        newImgs[idx] = previewUrl;
        return newImgs;
      });
    };
    reader.readAsDataURL(file);
  };

  function handleCancel(event) {
    setComponentState(null);
    if (isMounted) {
      const container = document.getElementById("myList");
      if (!isCreated) {
        const listItems = Array.from(container?.children);
        listItems?.forEach((listItem) => {
          // Perform your operations on each list item
          // For example, check if the element is empty
          if (listItem.innerHTML.trim() === "") {
            // The element is empty
            // Perform your logic here
            container?.removeChild(listItem);
          }
        });
      }
    }
  }

  function saveImg(event) {
    addCarouselObjContext();
    setComponentState(null);
    if (isMounted && container) {
      const listContainer = document.getElementById("myList");
      if (!isCreated) {
        if (listContainer) {
          const listItems = Array.from(listContainer?.children);
          listItems?.forEach((listItem) => {
            // Perform your operations on each list item
            // For example, check if the element is empty
            if (listItem.innerHTML.trim() === "") {
              // The element is empty
              // Perform your logic here
              listContainer?.removeChild(listItem);
            }
          });
        }
      }
    }
  }

  return (
    <div>
      <label
        className="block mb-2 text-normal font-semibold text-grayWhite"
        for="file_input"
      >
        Images from shopify
      </label>
      <snap className="text-start">
        Drag and move images into position you want them to appear on carousel.
      </snap>
      <snap className="text-start">You can have up to 5 images!</snap>
      <div className="mt-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((_, idx) => `img-${idx}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-row gap-2 h-[120px] border-2 border-gray-800 rounded-md overflow-x-auto p-2 bg-gray-900">
              {images.map((src, idx) => (
                <SortableImage
                  key={idx}
                  id={`img-${idx}`}
                  src={src}
                  idx={idx}
                  onRemove={handleRemoveImage}
                  onUpload={handleUploadImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <button
          type="button"
          className="bg-cyan-600 hover:bg-cyan-400  text-white font-semibold py-1 px-2 border-2 border-gray-800 rounded-lg"
          value={false}
          onClick={saveImg}
          style={{ marginRight: "10px" }}
          // disabled={file === undefined}
        >
          Save
        </button>
        <button
          type="button"
          id="cancel"
          className="bg-red-800 hover:bg-red-400 text-white font-semibold py-1 px-2 border-2 border-gray-800 rounded-lg"
          value={false}
          onClick={handleCancel}
          style={{ marginRight: "10px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Carousel;
