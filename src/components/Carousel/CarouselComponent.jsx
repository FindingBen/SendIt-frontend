import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "./CarouselComponent.css";
const CarouselComponent = ({ images }) => {

  return (
    <div className="carousel-wrapper">
      <Carousel>
        {(images || []).map((src, idx) => (
          <Carousel.Item>
            <img className="carousel-img" alt="carousel" src={src} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
