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

const AVAILABLE_CHANGES = [
  { key: "alt_text", label: "Alt text changes" },
  { key: "title", label: "Title change" },
  { key: "description", label: "Description change" },
  { key: "seo", label: "SEO meta change" },
];

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
    const [selectedChanges, setSelectedChanges] = useState(
  AVAILABLE_CHANGES.map(c => c.key)
);


const allSelected = selectedChanges.length === AVAILABLE_CHANGES.length;

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

        if (response.status === 200) {
          setProduct(response.data); // assuming backend returns single product object
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setProductLoading(false);
      }
    };

    const getDraftChanges = async () => {
    try {
      const response = await axiosInstance.get(`/products/product_optimize/`, {
        params: { product_id: product?.parent_product_id }
      });

      if (response.status === 200) {
        const { draft, original } = response.data;

        setDraftProduct(draft);
        setOriginalProduct(original);
      }

      } catch (error) {
        console.error(error);
      }
};

    const handleApprove = async (body) => {
      setLoading(true);
      console.log("APPROVE BODY:", body);
      try {
        let response = await axiosInstance.post('/products/optimize_shopify_product/',body)

        if(response.status===200){
          setOptimized(false)
          //setLoading(false);
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

    const toggleChange = (key) => {
  setSelectedChanges(prev =>
    prev.includes(key)
      ? prev.filter(k => k !== key)
      : [...prev, key]
  );
};

const toggleAll = () => {
  setSelectedChanges(allSelected ? [] : AVAILABLE_CHANGES.map(c => c.key));
};

const handleApprovedChanges = () => {
  if (selectedChanges.length === 0) return;

  const payload = {
     'product':product.product_id,
     'approval':true,
    approved_changes: selectedChanges,
  };

  handleApprove(payload);
};

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
      <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter overflow-x-hidden">
        <div className="flex flex-col">
          <div className="flex flex-row items-center h-16 bg-[#111827]/60 backdrop-blur-xl sticky top-0 z-10 border-b border-[#1C2437]/40">
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
  <section className="h-screen w-full bg-[#0A0E1A] text-white font-inter overflow-hidden">
    <div className="flex flex-col h-full">

      {/* NAV BAR */}
      <div className="flex flex-row items-center h-16 bg-[#111827]/60 backdrop-blur-xl sticky top-0 z-10 border-b border-[#1C2437]/40">
        <Search />
        <SmsPill />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-row ml-52 h-[calc(100vh-4rem)] overflow-hidden">

        {/* LEFT SIDE — SCROLLABLE */}
        <div
          className="
            w-[460px]
            h-full
            min-h-0
            overflow-y-auto
            overflow-x-hidden

            pr-6
            pl-10
            py-8

            bg-transparent
            border-r border-[#1C2437]/40
          "
        >
          <h2 className="text-lg font-semibold text-[#dbe1ff] tracking-wide mb-5">
            Product Details
          </h2>

          {/* Product Image */}
          <div className="h-72 rounded-2xl flex items-center justify-center text-gray-500 shadow-inner text-sm tracking-wide">
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
            {[
              { label: "Title", key: "title" },
              { label: "Description", key: "description" },
            ].map(({ label, key }) => {
              const isStatic = draftProduct?.product?.static === true;
              const oldVal = originalProduct?.[key] ?? product?.[key] ?? "";
              const newVal = draftProduct?.product?.[key] ?? null;
              const changed = newVal && newVal !== oldVal;

              return (
                <div key={key} className="flex flex-col">
                  <span className="text-[#e0e3ff] font-semibold tracking-wide mb-1">
                    {label}:
                  </span>

                  {label === "Description" && isStatic ? (
                    <span className="ml-2 text-[#3e6ff4] font-semibold tracking-wide">
                      Static description used
                    </span>
                  ) : changed ? (
                    <div className="flex flex-col ml-2">
                      <span className="text-gray-500 line-through opacity-60 text-sm">
                        {oldVal || "—"}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#3e6ff4] font-semibold tracking-wide">
                          {newVal}
                        </span>
                        <span className="text-xs font-bold px-2 py-[2px] rounded-full bg-[#3e6ff4]/20 text-[#3e6ff4] border border-[#3e6ff4]/40 animate-pulse">
                          NEW
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="ml-2 text-gray-300">{oldVal || "—"}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Images */}
          <ProductImageCarousel product={product} draftProduct={draftProduct} />
        </div>

        {/* RIGHT SIDE — STATIC */}
        <div className="flex-1 px-10 py-8 min-w-0 overflow-hidden">
          <div className="max-w-[420px] bg-[#111827]/60 backdrop-blur-xl border-2 border-[#1C2437]/40 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-[#dbe3ff] tracking-wide mb-4">
              Select changes to approve
            </h4>

            <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-[#23253a] bg-[#0c1025] px-4 py-3 mb-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="accent-[#3e6ff4]"
              />
              <span className="text-sm text-gray-200">Approve all changes</span>
            </label>

            {AVAILABLE_CHANGES.map(change => {
              const checked = selectedChanges.includes(change.key);

              return (
                <label
                  key={change.key}
                  className={`
                    flex items-center gap-3 cursor-pointer rounded-xl border-2 px-4 py-3 transition mb-2
                    ${checked
                      ? "border-[#3e6ff4] bg-[#111428]"
                      : "border-[#23253a] bg-[#0c1025] hover:bg-[#111428]"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChange(change.key)}
                    className="accent-[#3e6ff4]"
                  />
                  <span className="text-sm text-gray-200">{change.label}</span>
                </label>
              );
            })}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleApprovedChanges}
                disabled={loading || selectedChanges.length === 0}
                className="px-6 py-3 bg-ngrokBlue hover:bg-blue-900 disabled:bg-gray-600 rounded-xl text-white text-sm font-semibold transition-all"
              >
                {loading ? "Processing..." : "Approve"}
              </button>

              <button
                onClick={handleReject}
                disabled={loading}
                className="px-6 py-3 bg-red-800 hover:bg-red-500 rounded-xl text-white text-sm font-semibold transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

}

export default ProductOptimizationPage