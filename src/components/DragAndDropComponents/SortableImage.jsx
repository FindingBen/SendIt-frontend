import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableImage = ({ id, src, idx, onUpload }) => {
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
};

export default SortableImage;
