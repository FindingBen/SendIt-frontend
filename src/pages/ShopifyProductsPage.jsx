import { useEffect, useState } from "react";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";
import { ArrowLeft, ArrowRight, Barcode, Hash } from "lucide-react";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import GenerateModal from "../features/modal/GenerateModal";

export const ShopifyProductsPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentShopifyToken, currentUserState } = useRedux();
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const perPage = 5;
  const totalPages = Math.ceil(products?.length / perPage);
  const currentProducts = products?.slice((page - 1) * perPage, page * perPage);

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
    
    const payload = {
      products: selectedProducts,
      sku: type === "sku",
      barcode: type === "barcode",
    };

    console.log("Generate payload:", payload);
    try {
      const response = await axiosInstance.put("/products/shopify_products/", payload);
      console.log("Generate response:", response?.data);

      // Remove processed products from the list
      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p.id))
      );

      // Clear selection
      setSelectedProducts([]);
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      alert(`Failed to generate ${type.toUpperCase()} codes.`);
    }
  };

  return (
    <section className="min-h-screen w-full items-center justify-center bg-[#111827] text-white">
      <div className="flex flex-col">
        {/* Top navigation with search and pill */}
        <div className="flex flex-row items-center border-b-2 border-[#23253a] mb-4 h-16 bg-navBlue sticky top-0 z-10">
          <Search />
          <SmsPill />
        </div>

        {/* Main content */}
        <div className="ml-44">
          <div className="bg-[#111827] border-2 border-[#23253a] text-white w-[90%] mx-auto mt-6 rounded-2xl shadow-lg">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Your Shopify Products
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateModal("sku")}
                    disabled={selectedProducts.length === 0}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition ${
                      selectedProducts.length === 0
                        ? "bg-[#3e6ff4]/30 text-gray-400 cursor-not-allowed"
                        : "bg-[#3e6ff4] hover:bg-[#4937BA] text-white"
                    }`}
                  >
                    <Hash className="w-4 h-4 mr-1" />
                    Auto-generate SKU
                  </button>
                  <button
                    onClick={() => handleGenerateModal("barcode")}
                    disabled={selectedProducts.length === 0}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition ${
                      selectedProducts.length === 0
                        ? "bg-[#4937BA]/30 text-gray-400 cursor-not-allowed"
                        : "bg-[#4937BA] hover:bg-[#3e6ff4] text-white"
                    }`}
                  >
                    <Barcode className="w-4 h-4 mr-1" />
                    Auto-generate Barcode
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-gray-300 border-b border-[#23253a]">
                    <th className="pb-3 pl-3 font-medium">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={
                          currentProducts.length > 0 &&
                          currentProducts.every((p) =>
                            selectedProducts.includes(p.shopify_id)
                          )
                        }
                      />
                    </th>
                    <th className="pb-3">Image</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">#Bar Code</th>
                    <th className="pb-3">Sku</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-gray-400 py-8"
                      >
                        No products remaining.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product, idx) => (
                      <tr
                        key={idx}
                        className={`transition-all rounded-xl ${
                          selectedProducts.includes(product.shopify_id)
                            ? "bg-[#3e6ff4]/20 border border-[#3e6ff4]"
                            : "bg-[#1f2937] hover:bg-[#23253a]"
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.shopify_id)}
                            onChange={() => toggleProductSelection(product.shopify_id)}
                          />
                        </td>
                        <td className="p-3">
                          <img
                            src={product?.img_field || "/placeholder.png"}
                            alt={product?.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        </td>
                        <td className="p-3">{product?.title}</td>
                        <td className="p-3">{product?.quantity}</td>
                        <td className="p-3">{product?.price}</td>
                        <td className="p-3 font-semibold text-[#3e6ff4]">
                          {product?.barcode || "—"}
                        </td>
                        <td className="p-3 font-semibold text-[#3e6ff4]">
                          {product?.sku || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {products?.length > 0 && (
                <div className="flex justify-end items-center gap-3 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={`flex items-center text-sm px-3 py-2 rounded-lg transition ${
                      page === 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Prev
                  </button>
                  <span className="text-gray-400 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className={`flex items-center text-sm px-3 py-2 rounded-lg transition ${
                      page === totalPages
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <GenerateModal
            showModal={show}
            onClose={() => setShow(false)}
            option={generating}
            generateConfirm={() => handleGenerate(generating)}
          />
        </div>
      </div>
    </section>
  );
};
