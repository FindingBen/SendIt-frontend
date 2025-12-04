import { useEffect, useState } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";
import { ArrowLeft, ArrowRight, Barcode, Hash } from "lucide-react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizeProductModal from "../features/modal/OptimizeProductModal";
import ProductImageCarousel from "../components/Carousel/ProductImageCarousel";
import { useParams,useSearchParams } from "react-router-dom";

const ProductOptimizationPage = () => {
    const axiosInstance = useAxiosInstance();
    const [product, setProduct] = useState()
    const [showModal, setShowModal] = useState(false);
    const [draftProduct, setDraftProduct] = useState(null);
const [originalProduct, setOriginalProduct] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams] = useSearchParams();

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchProductDetails(id);
        }
    }, [id]);

    const fetchProductDetails = async (id) => {
        try {
            const response = await axiosInstance.get(`/products/shopify_products/${id}/`);
            console.log("Product Details Response:", response.data);
            if (response.status === 200) {
                setProduct(response.data); // assuming backend returns single product object
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    };
    const handleOptimize = async () => {
      try {
        let response = await axiosInstance.post(`/products/product_optimize/`, {
          product_id: product,
        });
        if (response.status === 200) {
          getDraftChanges()
        }
      } catch (error) {
       console.log("Optimization error:", error); 
      }
    }

    const getDraftChanges = async () => {
  try {
    const response = await axiosInstance.get(`/products/product_optimize/`, {
      params: { product_id: product.parent_product_id }
    });
    console.log("Draft Changes Response:", response.data);
    if (response.status === 200) {
      const { draft, original } = response.data;

      setDraftProduct(draft);
      setOriginalProduct(original);
    }

  } catch (error) {
    console.error(error);
  }
};

    const handleApprove = async () => {}
    const handleReject = async () => {}
  return (
    <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
  <div className="flex flex-col">

    {/* NAV BAR */}
    <div className="flex flex-row items-center mb-5 h-16 bg-[#111827]/60 backdrop-blur-xl sticky top-0 z-10 border-b border-[#1C2437]/40">
      <Search />
      <SmsPill />
    </div>

    {/* MAIN */}
    <div className="flex flex-row gap-10 px-10 ml-52">
<div
  className="
    w-[460px]
    bg-[#151530]/80
    border-2 border-gray-800
    rounded-3xl
    p-7
  "
>
  {/* Section Title */}
  <h2 className="text-lg font-semibold text-[#dbe1ff] tracking-wide mb-5">
    Product Details
  </h2>

  {/* Product Image */}
<div
  className="
    h-72
    rounded-2xl
    flex items-center justify-center
    text-gray-500
    shadow-inner
    text-sm tracking-wide
  "
>
  {draftProduct?.img_field || product?.img_field ? (
    <img
      src={draftProduct?.img_field || product.img_field}
      alt={draftProduct?.title || product?.title || "Product Image"}
      className="max-w-full max-h-full object-contain rounded-2xl"
    />
  ) : (
    <span>No image available</span>
  )}
</div>

{/* Info Section */}
<div className="mt-8 space-y-5 text-[15px] leading-relaxed">
  {/* Product Fields */}
  {[
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Category", key: "category" },
  ].map(({ label, key }) => {
    const oldVal = originalProduct?.[key] ?? product?.[key] ?? "";
    const newVal = draftProduct?.[key] ?? null;
    const changed = newVal && newVal !== oldVal;

    return (
      <div key={key} className="flex flex-col">
        <span className="text-[#e0e3ff] font-semibold tracking-wide mb-1">
          {label}:
        </span>

        {changed ? (
          <div className="flex flex-col ml-2">
            <span className="text-gray-500 line-through opacity-60 text-sm">
              {oldVal || "—"}
            </span>
            <span className="text-[#3e6ff4] font-semibold tracking-wide">
              {newVal}
            </span>
          </div>
        ) : (
          <span className="ml-2 text-gray-300">{oldVal || "—"}</span>
        )}
      </div>
    );
  })}

  {/* Images with alt_text */}
{/* Images with alt_text */}
{/* Images Section */}
{/* Images Section */}
<ProductImageCarousel product={product} draftProduct={draftProduct} />






</div>

</div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-10 w-[550px]">

        {/* OPTIMIZATION BOX */}
        <div className="
          bg-[#151530]/80 
          border-2 border-[#23253a] 
          rounded-3xl 
          p-7 
          shadow-[0_0_20px_rgba(62,111,244,0.06)]
          backdrop-blur-lg
        ">

          <h3 className="text-[17px] font-semibold text-[#dbe3ff] tracking-wide mb-3">
            Optimization
          </h3>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed tracking-wide">
            Enhance your product information with AI — costs
            <span className="text-[#3e6ff4] font-semibold ml-1">10 credits</span>.
          </p>

          {/* Optimize Button */}
          <button
            onClick={() => setShowModal(true)}
            className="
              group
              px-7 py-3 
              bg-[#3e6ff4] 
              hover:bg-[#3e6ff4]/90 
              rounded-xl 
              text-white 
              text-[15px]
              font-semibold
              mx-auto
              tracking-wide
              transition-all
              flex items-center gap-2
              
            "
          >
            <span>Optimize</span>
            <svg
          className="
            w-5 h-5
            text-white 
            transition-all 
            duration-500 
            group-hover:scale-125 
            group-hover:rotate-12
            drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]
          "
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l1.8 4.5L18 8.2l-3.4 3 1 4.8-4-2-4 2 1-4.8L6 8.2l4.2-.7L12 2z" />
        </svg>
          </button>
        </div>

        {/* PREVIEW BOX */}
        <div className="
          bg-[#151530]/80 
          border-2 border-[#23253a] 
          rounded-3xl 
          p-7
          shadow-[0_0_25px_rgba(62,111,244,0.05)]
          backdrop-blur-lg
        ">

          <h3 className="text-[17px] font-semibold text-[#dbe3ff] tracking-wide mb-4">
            Review Changes
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed tracking-wide mb-7">
            Carefully check the AI-generated changes before applying them to your Shopify store.
          </p>

          <div className="flex gap-4">

            {/* APPROVE */}
            <button
              onClick={handleApprove}
              className="
                px-7 py-3 
                bg-green-600 hover:bg-green-500 
                rounded-xl 
                text-white 
                text-[15px]
                font-semibold 
                tracking-wide
                transition-all
              "
            >
              Approve
            </button>

            {/* REJECT */}
            <button
              onClick={handleReject}
              className="
                px-7 py-3 
                bg-red-600 hover:bg-red-500 
                rounded-xl 
                text-white 
                text-[15px]
                font-semibold
                tracking-wide
                transition-all
              "
            >
              Reject
            </button>
          </div>
        </div>

      </div>
      <OptimizeProductModal showModal={showModal} onClose={() => setShowModal(false)} awaitOptimize={handleOptimize}/>
    </div>
  </div>
</section>



  )
}

export default ProductOptimizationPage