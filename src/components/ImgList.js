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
    </div>
  );
};

export default ImgList;
