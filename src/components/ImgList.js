import React, { useEffect, useState } from "react";
import "../css/CreationMessage.css";
const ImgList = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  useEffect(() => {
    setImageSrc(imageUrl);
  }, [imageUrl]);

  return (
    <div>
      <img key={imageUrl} src={`${imageSrc}`} width="300" />
      <div className="image__overlay">
        <div className="image__title">Click to remove</div>
      </div>
    </div>
  );
};

export default ImgList;
