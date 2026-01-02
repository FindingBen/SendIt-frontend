import { useEffect, useState, useCallback } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";
import { ArrowLeft, ArrowRight, Barcode, Hash } from "lucide-react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import useNotificationSocket from "../hooks/useNotificationSocket";
import { Link, redirect, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizeProductModal from "../features/modal/OptimizeProductModal";
import ProductImageCarousel from "../components/Carousel/ProductImageCarousel";
import { useParams,useSearchParams } from "react-router-dom";

const ProductOptimizationPage = () => {
    const axiosInstance = useAxiosInstance();
    const [product, setProduct] = useState()
    const [productLoading, setProductLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [draftProduct, setDraftProduct] = useState(null);
    const [originalProduct, setOriginalProduct] = useState(null);
    const [optimized, setOptimized] = useState(false)
    const [loading, setLoading] = useState(false); 
    const [approved, setApproved] = useState()
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchProductDetails(id);
        }
    }, [id]);

    useEffect(() => {
      if(product){
        getDraftChanges()
      }
    },[product]);

    const fetchProductDetails = async (id) => {
      setProductLoading(true);
      try {
        const response = await axiosInstance.get(`/products/shopify_products/${id}/`);
        console.log("Product Details Response:", response.data);
        if (response.status === 200) {
          setProduct(response.data); // assuming backend returns single product object
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setProductLoading(false);
      }
    };
    console.log("Current Product:", product);
    const getDraftChanges = async () => {
  try {
    const response = await axiosInstance.get(`/products/product_optimize/`, {
      params: { product_id: product?.parent_product_id }
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

  const handleNotification = useCallback((data) => {
    // Accept multiple payload shapes depending on your Channels setup
    const payload = data.payload || data || {};
    const event = payload.event || payload.type || null;
    const jobId = payload.job_id || payload.jobId || payload.job || null;
    const productId = payload.product_id || payload.productId || payload.product || null;
    console.log("Received notification:", data);
    if (!event) return;

    if (event === "OPTIMIZATION_DONE" || event === "OPTIMIZATION_FAILED") {
      // if product matches current page product, refresh draft
      if (productId && product && product.product_id === productId) {
        getDraftChanges();
        setOptimized(true);
      } else {
        // if no productId provided or different, still refresh list or ignore
      }
    }
  }, [product]);

  // connect to websocket to receive notifications (path can be adjusted)
  useNotificationSocket({ path: "/ws/notifications/", onMessage: handleNotification });

    const handleApprove = async () => {
      setLoading(true);
      const body = {
        'product':product.product_id,
        'approval':true
      }
      try {
        let response = await axiosInstance.post('/products/optimize_shopify_product/',body)

        if(response.status===200){
          setOptimized(false)
          navigate('/products_shopify');
        }
      } catch (error) {
        setLoading(false);
        console.log(error)
      }
    }
    const handleReject = async () => {
      setLoading(true);
      const body = {
        'product':product.product_id,
        'approval':false
      }
      try {
        let response = await axiosInstance.post('/products/optimize_shopify_product/',body)

        if(response.status===200){
          setOptimized(false)
          navigate('/products_shopify');
        }
      } catch (error) {
        setLoading(false);
        console.log(error)
      }
    }

  // If product is already optimized, render the optimized-product view (placeholder)
  if (productLoading) {
    return (
      <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-5 h-16 bg-[#111827]/60 backdrop-blur-xl sticky top-0 z-10 border-b border-[#1C2437]/40">
            <Search />
            <SmsPill />
          </div>
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-transparent border-t-[#3e6ff4] rounded-full animate-spin" />
              <span className="text-gray-400">Loading product…</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (product?.optimized) {
    return (
      <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-5 h-16 bg-[#111827]/60 backdrop-blur-xl sticky top-0 z-10 border-b border-[#1C2437]/40">
      <Search />
      <SmsPill />
    </div>
          <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-[#151530]/80 border-2 border-gray-800 rounded-3xl p-8">
            <h2 className="text-lg font-semibold text-[#dbe1ff] mb-2">Optimized Product</h2>
            <p className="text-gray-400">This product is already optimized. Start new optimization if you want new changes.</p>
            <Link to="/products_shopify/" className="inline-flex items-center gap-2 text-[#3e6ff4] hover:opacity-90 mt-3">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
        </div>
        
      </section>
    );
  }

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
      alt={draftProduct?.product.title || product?.title || "Product Image"}
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
    // { label: "Category", key: "category" },
  ].map(({ label, key }) => {
    const isStatic = draftProduct?.product?.static === true;
    const oldVal = originalProduct?.[key] ?? product?.[key] ?? "";
    const newVal = draftProduct?.product?.[key] ?? null;
    const changed = newVal && newVal !== oldVal;

    return (
      <div key={key} className="flex flex-col">
      {/* Label */}
      <span className="text-[#e0e3ff] font-semibold tracking-wide mb-1">
        {label}:
      </span>

      {/* Special: Static description used */}
      {label === "Description" && isStatic ? (
        <span className="ml-2 text-[#3e6ff4] font-semibold tracking-wide">
          Static description used
        </span>
      ) : changed ? (
        /* Changed field view */
        <div className="flex flex-col ml-2">
          <span className="text-gray-500 line-through opacity-60 text-sm">
            {oldVal || "—"}
          </span>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#3e6ff4] font-semibold tracking-wide">
              {newVal}
            </span>

            <span
              className="
                text-xs 
                font-bold 
                px-2 py-[2px] 
                rounded-full 
                bg-[#3e6ff4]/20 
                text-[#3e6ff4] 
                border border-[#3e6ff4]/40
                animate-pulse
              "
            >
              NEW
            </span>
          </div>
        </div>
      ) : (
        /* Default unchanged */
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

        {/* PREVIEW BOX */}
      
        <div
          className="
            bg-[#151530]/80 
            border-2 border-[#23253a] 
            rounded-3xl 
            p-7
            shadow-[0_0_25px_rgba(62,111,244,0.05)]
            backdrop-blur-lg
            relative
          "
        >
          <h3 className="text-[17px] font-semibold text-[#dbe3ff] tracking-wide mb-4">
            Review Changes
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed tracking-wide mb-7">
            Carefully check the AI-generated changes before applying them to your Shopify store.
          </p>

          {/* Buttons */}
          <div className="flex items-center">
            <button
              onClick={handleApprove}
              disabled={loading} // prevent double click
              className="
                px-7 py-3 
                bg-green-600 hover:bg-green-500 
                rounded-xl 
                text-white
                mx-2
                text-[15px]
                font-semibold 
                tracking-wide
                transition-all
                relative
              "
            >
              {loading ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={handleReject}
              disabled={loading} // prevent actions while loading
              className="
                px-7 py-3 
                bg-red-600 hover:bg-red-500 
                rounded-xl
                mx-2
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