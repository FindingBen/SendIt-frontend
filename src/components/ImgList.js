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
          alt="Preview.."
          width="220"
          height="300"
          className="w-100"
        />
      ) : (
        <img
          class="h-auto w-[350px] 2xl:w-[450px] rounded-lg object-cover"
          alt="Placeholder.."
          loading="lazy"
          src={require("../../src/assets/sampleImage.jpg")}
        />
      )}
    </div>
  );
};

export default ImgList;
