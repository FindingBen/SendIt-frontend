import { useEffect, useState } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";
import { ArrowLeft, ArrowRight, Barcode, Hash } from "lucide-react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import {setUserInfo} from "../redux/reducers/userReducer"
import GenerateModal from "../features/modal/GenerateModal";
import ConfirmProductImport from "../features/modal/ConfirmProductImport";

export const ShopifyProductsPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUserState, dispatch } = useRedux();
  const [show, setShow] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const perPage = 5;
  const totalPages = Math.ceil(products?.length / perPage);
  const currentProducts = products?.slice((page - 1) * perPage, page * perPage);
  const importState = currentUserState.product_import
  const rulesetState = currentUserState.business_analysis

  useEffect(() => {
    getProducts();
  }, []);

    useEffect(() => {
    getProducts();
  }, [show]);

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/shopify_products/");
      setProducts(response?.data);
      console.log("Fetched products:", response?.data);
    } catch (error) {
      console.error("Error fetching Shopify products:", error);
    }
  };

  const importBulkProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/import_bulk_products/");
      
      if(response.status === 201){
        getProducts()
        dispatch(setUserInfo({ product_import: true }));

      }
    } catch (error) {
      console.error("Error fetching Shopify products:", error);
    }
  };

  const testShop = async () => {
    try {
      const response = await axiosInstance.get("/products/business_analysis/");
      
      if(response.status === 201){
        // getProducts()
        // dispatch(setUserInfo({ product_import: true }));
        console.log(response)
      }
    } catch (error) {
      console.error("Error fetching Shopify products:", error);
    }
  };

  // Toggle single product selection
  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Select/Deselect all on current page
  const toggleSelectAll = () => {
    const currentIds = currentProducts.map((p) => p.shopify_id);
    const allSelected = currentIds.every((id) => selectedProducts.includes(id));

    if (allSelected) {
      setSelectedProducts((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedProducts((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };

  const handleGenerateModal = (type) => {
    setGenerating(type)
    setShow(true);
  }

  // Handle SKU or Barcode generation
const handleGenerate = async (type) => {
  if (selectedProducts.length === 0) return;

  const payload = {
    products: selectedProducts, // these are shopify_id
    sku: type === "sku",
    barcode: type === "barcode",
  };

  console.log("Generate payload:", payload);

  try {
    const response = await axiosInstance.put("/products/shopify_products/", payload);
    console.log("Generate response:", response?.data);

    // ✅ Re-fetch fresh product data to update SKUs/barcodes
    await getProducts();

    // ✅ Clear selection
    setSelectedProducts([]);
  } catch (error) {
    console.error(`Error generating ${type}:`, error);
    alert(`Failed to generate ${type.toUpperCase()} codes.`);
  }
};

 const formatScore = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? "—" : n.toFixed(2);
  };

   const scorePill = (v) => {
    const n = parseFloat(v);
    if (isNaN(n)) return { label: "—", classes: "bg-gray-800 text-gray-300" };
    if (n < 40) return { label: formatScore(n), classes: "bg-red-600/15 text-red-400" };
    if (n < 70) return { label: formatScore(n), classes: "bg-yellow-500/15 text-yellow-400" };
    return { label: formatScore(n), classes: "bg-green-600/15 text-green-400" };
  };


  return (
<section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
  <div className="flex flex-col">
    {/* Sticky top bar */}
    <div className="flex flex-row items-center mb-6 h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-10 border-b border-[#1C2437]/40">
      <Search />
      <SmsPill />
    </div>

    <div className="ml-44">
      <div className="w-[90%] mx-auto mt-8 bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-gray-100 tracking-wide">
              Your Shopify Products
            </h2>
            {!importState ? (<>{rulesetState ? (
              <button
                onClick={() => setShowImport(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 shadow-[0_0_12px_rgba(62,111,244,0.25)]"
              >
                Import products
              </button>
            ) : (
              <div
                role="status"
                className="px-4 py-2 rounded-lg bg-[#3A3F52] text-yellow-300 text-sm font-medium"
                title="Enable ruleset first to import your products"
              >
                Enable ruleset first to import your products
              </div>
            )}</>):<></>}
            </div>


            <div className="flex gap-3">
              <button
                disabled={true}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedProducts.length === 0
                    ? "bg-[#3E6FF4]/15 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 text-white shadow-[0_0_12px_rgba(62,111,244,0.25)]"
                }`}
              >
              
                Optimize SEO and Completness
              </button>
              <button
                onClick={() => handleGenerateModal("sku")}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedProducts.length === 0
                    ? "bg-[#3E6FF4]/15 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 text-white shadow-[0_0_12px_rgba(62,111,244,0.25)]"
                }`}
              >
                <Hash className="w-4 h-4 mr-2" />
                Auto-generate SKU
              </button>

              <button
                onClick={() => handleGenerateModal("barcode")}
                disabled={selectedProducts.length === 0}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedProducts.length === 0
                    ? "bg-[#4937BA]/15 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#4937BA] to-[#3E6FF4] hover:opacity-90 text-white shadow-[0_0_12px_rgba(73,55,186,0.25)]"
                }`}
              >
                <Barcode className="w-4 h-4 mr-2" />
                Auto-generate Barcode
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
  {currentProducts?.length === 0 ? (
    <div className="text-center py-16 bg-[#1F273A] rounded-2xl text-gray-400">
      <div className="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3 text-[#3E6FF4]/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3v18h18M9 9l6 6M15 9l-6 6"
          />
        </svg>
        <span className="text-lg font-medium">No products yet</span>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {currentProducts.map((product, idx) => {
        const selected = selectedProducts.includes(product.shopify_id);
        const seoValue = product?.score?.seo_score ?? product?.score?.seo ?? "0";
        const completenessValue = product?.score?.completness ?? product?.score?.completeness ?? product?.score?.completeness_score ?? "0";

        const seoP = scorePill(seoValue);
        const compP = scorePill(completenessValue);
        return (
          <div
            key={idx}
            onClick={() => toggleProductSelection(product.shopify_id)}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 cursor-pointer 
              ${
                selected
                  ? "bg-[#3E6FF4]/15 shadow-[0_0_12px_rgba(62,111,244,0.25)]"
                  : "bg-[#1F273A] hover:bg-[#242E44] hover:shadow-[0_0_10px_rgba(62,111,244,0.15)]"
              }`}
          >
            {/* Left side: checkbox + image + title */}
            <div className="flex items-center gap-4">
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleProductSelection(product.shopify_id)}
                  className="w-5 h-5 accent-[#3E6FF4] rounded-md bg-[#1C2437] cursor-pointer hover:scale-110 transition-all"
                />
              </div>

              <div className="flex items-center gap-4 text-start">
                <img
                  src={product?.img_field || "/placeholder.png"}
                  alt={product?.title}
                  className="w-16 h-16 rounded-xl object-cover shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                />
                <div>
                  <p className="text-gray-200 font-medium">{product?.title}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {product?.quantity || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: price + barcode + SKU */}
            <div className="flex items-center gap-10">
              <div className="flex flex-col text-right">
                <span className="text-gray-400 text-sm">Seo Score</span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${seoP.classes}`}>
                  {seoP.label}
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-gray-400 text-sm">Completness</span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${compP.classes}`}>
                  {compP.label}
                </span>
              </div>

              {/* <div className="flex flex-col text-right">
                <span className="text-gray-400 text-sm">Price</span>
                <span className="text-gray-100 font-semibold">
                  ${product?.price || "0.00"}
                </span>
              </div> */}

              <div className="flex flex-col text-right">
                <span className="text-gray-400 text-sm">Barcode</span>
                <span className="text-[#3E6FF4] font-semibold">
                  {product?.barcode || "—"}
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-gray-400 text-sm">SKU</span>
                <span className="text-[#3E6FF4] font-semibold">
                  {product?.sku || "—"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
<GenerateModal
            showModal={show}
            onClose={() => setShow(false)}
            option={generating}
            generateConfirm={() => handleGenerate(generating)}
          />
          <ConfirmProductImport showModal={showImport} onClose={() => setShowImport(false)} importConfirm={importBulkProducts}/>

          {/* Pagination */}
          {products?.length > 0 && (
            <div className="flex justify-end items-center gap-4 mt-8 text-gray-400">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={`flex items-center text-sm px-3 py-2 rounded-md transition ${
                  page === 1
                    ? "text-gray-600 cursor-not-allowed"
                    : "hover:text-[#3E6FF4]"
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Prev
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className={`flex items-center text-sm px-3 py-2 rounded-md transition ${
                  page === totalPages
                    ? "text-gray-600 cursor-not-allowed"
                    : "hover:text-[#3E6FF4]"
                }`}
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</section>

  );
};
