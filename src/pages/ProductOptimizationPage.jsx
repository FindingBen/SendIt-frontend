import { useEffect, useState } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";
import { ArrowLeft, ArrowRight, Barcode, Hash } from "lucide-react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import { useParams,useSearchParams } from "react-router-dom";

const ProductOptimizationPage = () => {
    const axiosInstance = useAxiosInstance();
    const [product, setProduct] = useState()
    // const { productId } = useParams();
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    console.log("Product", product);
    useEffect(() => {
        if (id) {
            fetchProductDetails(id);
        }
    }, [id]); // <-- add productId to dependencies
    console.log("Product ID:", id);
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
    const handleOptimize = async () => {}
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

      {/* LEFT CARD */}
      <div className="
        w-[460px] 
        bg-[#151530]/80 
        border border-[#23253a] 
        rounded-3xl 
        p-7 
        shadow-[0_0_25px_rgba(62,111,244,0.08)]
        backdrop-blur-lg
      ">
        
        {/* Section Title */}
        <h2 className="text-lg font-semibold text-[#dbe1ff] tracking-wide mb-5">
          Product Details
        </h2>

        {/* Product Image */}
        <div className="
      w-full h-72 
      bg-[#23253a]/60 
      border border-[#2f3146]
      rounded-2xl 
      flex items-center justify-center 
      text-gray-500
      shadow-inner
      text-sm tracking-wide
    ">
  {product?.img_field ? (
    <img 
      src={product.img_field} 
      alt={product.title || "Product Image"} 
      className="max-w-full max-h-full object-contain rounded-2xl"
    />
  ) : (
    <span>No image available</span>
  )}
</div>

        {/* Info Section */}
        <div className="mt-8 space-y-4 text-gray-300 text-[15px] leading-relaxed">

          <p>
            <span className="text-[#e0e3ff] font-semibold tracking-wide">Title:</span>
            <span className="ml-2 text-gray-400">{product?.title}</span>
          </p>

          <p>
            <span className="text-[#e0e3ff] font-semibold tracking-wide">Description:</span>
            <span className="ml-2 text-gray-400">{product?.description}</span>
          </p>

          <p>
            <span className="text-[#e0e3ff] font-semibold tracking-wide">Alt text:</span>
            <span className="ml-2 text-gray-400">{product?.altText}</span>
          </p>

          <p>
            <span className="text-[#e0e3ff] font-semibold tracking-wide">Category:</span>
            <span className="ml-2 text-gray-400">{product?.category}</span>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-10 w-[550px]">

        {/* OPTIMIZATION BOX */}
        <div className="
          bg-[#151530]/80 
          border border-[#23253a] 
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
            onClick={handleOptimize}
            className="
              group
              px-7 py-3 
              bg-[#3e6ff4] 
              hover:bg-[#3e6ff4]/90 
              rounded-xl 
              text-white 
              text-[15px]
              font-semibold 
              tracking-wide
              transition-all
              flex items-center gap-2
              shadow-[0_0_18px_rgba(62,111,244,0.35)]
            "
          >
            <span>Optimize</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* PREVIEW BOX */}
        <div className="
          bg-[#151530]/80 
          border border-[#23253a] 
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
    </div>
  </div>
</section>



  )
}

export default ProductOptimizationPage