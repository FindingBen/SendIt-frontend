import React from "react";

// ColorExtractor component props
export const Props = {
  // Invoked when there is an error other than CORS or DOM
  onError: (err) => {},
  // Main callback which is invoked with all the colors extracted from the image (hex, rgb or hsl)
  getColors: (colors) => {},
  // Output colors in format RGB
  rgb: false,
  // Extract colors from the image provided via `src` prop
  src: "",
  // Max color count for amount of colors from which swatches will be generated
  maxColors: 0,
  children: null,
};

export const Image = HTMLElement || string || Blob;
