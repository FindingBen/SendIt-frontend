import React, { useState, useEffect } from "react";
import "./CarouselComponent.css";

const CarouselComponent = ({
  images,
  toDelete,
  item,
  interval = 3000,
  context,
}) => {
  const [current, setCurrent] = useState(0);

  // if (!images.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  console.log(context);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  useEffect(() => {
    // Reset to first image if images prop changes
    setCurrent(0);
  }, [images]);

  return (
    <div
      className="relative mx-3 flex flex-col items-center justify-center w-[91%]"
      style={{ height: 180, borderRadius: 8 }}
    >
      {/* X Button */}
      {/* ... */}

      {/* Image */}
      <img
        src={context ? images[0][current] : images[current]}
        alt={`carousel-${current}`}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "contain",
          borderRadius: 6,
          marginBottom: 2,
        }}
      />

      {/* Centered Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 bg-gray-700 text-white px-2 py-1 rounded-full flex items-center justify-center"
        style={{ width: 32, height: 32, transform: "translateY(-50%)" }}
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chevron-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 bg-gray-700 text-white px-2 py-1 rounded-full flex items-center justify-center"
        style={{ width: 32, height: 32, transform: "translateY(-50%)" }}
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chevron-right"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>

      {/* Dots or other controls can go here */}
    </div>
  );
};

export default CarouselComponent;
