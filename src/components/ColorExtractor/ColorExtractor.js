import React, { useEffect } from "react";
import { Vibrant } from 'node-vibrant';

const ColorExtractor = ({
  onError = () => {},
  getColors = () => {},
  rgb = false,
  hex = true,
  src = null,
  maxColors = 64,
  children,
}) => {
  useEffect(() => {
    const processImage = () => {
      if (children) {
        if (React.Children.count(children) === 1) {
          const onlyChild = React.Children.only(children);
          if (onlyChild.type === "img") {
            Vibrant.from(onlyChild.props.src)
              .maxColorCount(maxColors)
              .getSwatches()
              .then((swatches) => getColors(getColorsFromSwatches(swatches)))
              .catch((error) => {
                if (error) {
                  // handleDefaultImageClass(onlyChild.props.src);
                }
              });
          } else {
            throw new Error(
              `Expected children to be an image element but instead got a "${onlyChild.type}"`
            );
          }
        }
      } else if (src && typeof src === "string" && src.length > 0) {
        Vibrant.from(src)
          .maxColorCount(maxColors)
          .getSwatches()
          .then((swatches) => getColors(getColorsFromSwatches(swatches)))
          .catch((error) => {
            if (error) {
              // handleDefaultImageClass(src);
            }
          });
      } else {
        console.error(
          "Please provide an image url using the 'src' prop or wrap an image element under the <ColorExtractor /> component. Check out the docs for more info - https://goo.gl/rMZ5L7"
        );
      }
    };

    processImage();
  }, [src, children, getColors, maxColors, onError, rgb]);

  const getColorsFromSwatches = (swatches) => {
    const colors = [];

    for (let swatch in swatches) {
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
        if (rgb) {
          colors.push(swatches[swatch].getRgb());
        } else {
          colors.push(swatches[swatch].getHex());
        }
      }
    }

    return colors;
  };

  if (React.Children.count(children) > 1) {
    throw new Error("Expected only one image element.");
  } else if (React.Children.count(children) === 1) {
    if (children.type === "img") {
      return children;
    } else {
      throw new Error(
        `Expected children to be an image element but instead got a "${children.type}"`
      );
    }
  } else {
    return null;
  }
};

export default ColorExtractor;
