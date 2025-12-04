import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageCarousel = ({ product, draftProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
    console.log('DRAFT CAROUSEL',draftProduct)
  // Merge draft alt text with original product media
  useEffect(() => {
    if (!product?.media) return;

    const updatedImages = product.media.map((img) => {
      const draftImg = draftProduct?.images?.find(
        (d) => d.id === img.shopify_media_id
      );
      return {
        ...img,
        draftAlt: draftImg?.alt_text || img.alt_text || "—",
      };
    });

    setImages(updatedImages);
    setCurrentIndex(0); // reset carousel when new draft arrives
  }, [product, draftProduct]);

  if (!images.length) return <div>No images available</div>;

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const currentImg = images[currentIndex];
  const oldAlt = currentImg.alt_text || "—";
  const newAlt = currentImg.draftAlt || oldAlt;
  const changed = newAlt !== oldAlt;

  return (
    <div className="w-full max-w-md mx-auto bg-[#151530] border-2 border-[#23253a] rounded-3xl p-4 shadow-lg relative">
      {/* Image */}
      {currentImg.src ? (
        <img
          src={currentImg.src}
          alt={newAlt}
          className="w-full h-64 object-contain rounded-2xl bg-[#23253a]"
        />
      ) : (
        <div className="w-full h-64 bg-[#23253a] flex items-center justify-center rounded-2xl text-gray-400">
          No image available
        </div>
      )}

      {/* Alt Text */}
      <div className="flex flex-col gap-1 mt-4 text-center text-sm text-gray-300">
        {changed ? (
          <>
            <span className="text-gray-300">Alt text: <span className="text-gray-500 line-through opacity-90">{oldAlt}</span></span>
            <span>New alt text:<span className="text-[#3e6ff4] font-semibold ml-1">{newAlt}</span></span>
          </>
        ) : (
          <span>{oldAlt}</span>
        )}
      </div>

      {/* Image ID */}
      <div className="text-center text-xs text-gray-400 mt-1">
        ID: {currentImg.id}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-[#23253a] hover:bg-[#3e6ff4]/30 p-2 rounded-full text-white shadow"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-[#23253a] hover:bg-[#3e6ff4]/30 p-2 rounded-full text-white shadow"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-3 gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === currentIndex ? "bg-[#3e6ff4]" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
