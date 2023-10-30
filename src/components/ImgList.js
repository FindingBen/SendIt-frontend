import React, { useEffect, useState } from "react";
import "../css/CreationMessage.css";
const ImgList = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  useEffect(() => {
    setImageSrc(imageUrl);
  }, [imageUrl]);

  return (
    <div>
      {imageSrc ? (
        <img
          key={imageUrl}
          src={`${imageSrc}`}
          width="220"
          height="300"
          className="w-100"
        />
      ) : (
        <img
          class="h-auto max-w-lg rounded-lg object-cover"
          width="220"
          loading="lazy"
          src={require("../../src/assets/sampleImage.jpg")}
        />
      )}
    </div>
  );
};

export default ImgList;
