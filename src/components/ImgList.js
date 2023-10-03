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
        <img key={imageUrl} src={`${imageSrc}`} width="260" />
      ) : (
        <img
          class="h-auto max-w-lg rounded-lg object-cover"
          width="260"
          loading="lazy"
          src={require("../../src/assets/sampleImage.jpg")}
        />
      )}
    </div>
  );
};

export default ImgList;
