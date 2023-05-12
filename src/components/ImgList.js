import React, { useEffect, useState } from "react";

const ImgList = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  useEffect(() => {
    setImageSrc(imageUrl);
  }, [imageUrl]);

  return <img name="image" src={`${imageSrc}`} width="260" />;
};

export default ImgList;
