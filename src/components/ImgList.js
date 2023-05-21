import React, { useEffect, useState } from "react";

const ImgList = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  useEffect(() => {
    setImageSrc(imageUrl);
  }, [imageUrl]);

  return <img key={imageUrl} src={`${imageSrc}`} width="300" />;
};

export default ImgList;
