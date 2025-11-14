import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StepsComponent from "../components/StepsComponent/StepsComponent";
import CampaignInfoStep from "../components/StepsComponent/CampaignInfoStep";
import CreateContentStep from "../components/StepsComponent/CreateContentStep";
import ShopifyProductsCampaignBuilder from "../components/StepsComponent/ShopifyProductsCampaignBuilder";
import ReviewCreateStep from "../components/StepsComponent/ReviewCreateStep";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import SmsPill from "../components/SmsPill/SmsPill";
const CreateCampaign = () => {
  const axiosInstance = useAxiosInstance();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [completedSteps, setCompletedSteps] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [shopifyCampaign, setShopifyCampaign] = useState(false);
  const [shopifyProductSingle, setShopifyProductSingle] = useState({});
  const [insights, setInsights] = useState([]);
  const [callShopify, setCallShopify] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadInsights, setLoadInsights] = useState(false);
  const [search_name, setSearchName] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignInfo: {},
    shopifyProduct: {},
    contentElements: [],
  }); // Store data from all steps
  const { currentShopifyToken, currentShopId } = useRedux();
  const debounceTimeout = useRef();
  useEffect(() => {
    if (currentShopifyToken) {
      // Clear previous debounce
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(() => {
        fetchShopify();
      }, 600); // 400ms debounce
    }
    // Cleanup on unmount
    return () => clearTimeout(debounceTimeout.current);
  }, [callShopify, search_name, currentShopifyToken]);

  useEffect(() => {
    if (formData.campaignInfo.campaignContent === "Shopify") {
      setShopifyCampaign(true);
      // getInsights();
    }
  }, [formData]);

  useEffect(() => {}, [shopifyCampaign]);

  const getShopifyProduct = async (product_id) => {
    setProductLoading(true);
    try {
      let response = await axiosInstance.post(`/api/shopify_product/`, {
        id: product_id,
      });

      if (response.status === 200) {
        setShopifyProductSingle(response.data);
        setProductLoading(false);
      }
    } catch (error) {
      console.log(error);
      setProductLoading(false);
    }
  };

  const updateFormData = (stepData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
  };

  const handleShopifyProduct = (product_id) => {
    getShopifyProduct(product_id);
    setSelected(product_id);
  };

  const handleProductInsights = (product_id) => {
    getProductInsights(product_id);
  };

  const handleCloseCard = () => {
    setSelected(null); // Hide card
    setInsights([]);
  };

  const nextStep = () => {
    // Mark the current step as completed
    setCompletedSteps((prevSteps) => {
      if (!prevSteps.includes(currentStep)) {
        return [...prevSteps, currentStep];
      }
      return prevSteps;
    });

    // Move to the next step
    setCurrentStep((prevStep) =>
      shopifyCampaign ? Math.min(prevStep + 1, 4) : Math.min(prevStep + 1, 3)
    ); // Ensure it doesn't exceed the total steps
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const getProductInsights = async (product_id) => {
    setLoadInsights(true);
    try {
      let response = await axiosInstance.post(
        "/api/shopify_product_insights/",
        {
          product_id: product_id,
        }
      );
      if (response.status === 201) {
        setInsights(response.data.data);
        setLoadInsights(false);
      }
    } catch (error) {
      setLoadInsights(false);
    }
  };

  const handleSearchChange = (search) => {
    setSearchName(search);
  };

  const handleApi = () => {
    fetchShopify();
  };
  const handleShopifyTrigger = (value) => {
    if (value === "Shopify") {
      setShopifyCampaign(true);
    } else {
      setShopifyCampaign(false);
    }
  };
  const fetchShopify = async () => {
    setLoading(true);
    try {
      const queryParts = [];
      let url = "/api/shopify_products/";
      if (search_name) queryParts.push(`search=${search_name}`);

      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
      }
      let response = await axiosInstance.get(url);

      if (response.status === 200) {
        const products = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.descriptionHtml,
          createdAt: item.createdAt,
          inventoryQuantity: item.totalInventory,
          hasOutofStockVariants: item.hasOutOfStockVariants,
          publishedToStore: item.publishedAt,
          variantsCount: item.variantsCount,
          image: item?.image,
        }));
        setLoading(false);
        setShopifyProducts(products);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const renderStep = () => {
    if (shopifyCampaign) {
      switch (currentStep) {
        case 1:
          return (
            <CampaignInfoStep
              nextStep={nextStep}
              tokenType={currentShopifyToken}
              updateFormData={updateFormData}
              initialData={formData.campaignInfo}
              shopifyCampaignTrigger={handleShopifyTrigger}
            />
          );
        case 2:
          return (
            <ShopifyProductsCampaignBuilder
              shopifyProducts={shopifyProducts}
              nextStep={nextStep}
              prevStep={prevStep}
              initialData={formData.campaignInfo}
              updateFormData={updateFormData}
              selected={selected}
              loading={loading}
              productLoading={productLoading}
              insightsLoading={loadInsights}
              onCloseCard={handleCloseCard}
              insights={insights}
              search={handleSearchChange}
              apiCall={handleApi}
              shopifyProduct={shopifyProductSingle}
              getInsights={handleProductInsights}
              onProductSelect={handleShopifyProduct}
            />
          );
        case 3:
          return (
            <CreateContentStep
              nextStep={nextStep}
              prevStep={prevStep}
              shopifyProducts={shopifyProducts}
              updateFormData={updateFormData}
              initialData={formData.shopifyProduct}
            />
          );
        case 4:
          return <ReviewCreateStep prevStep={prevStep} formData={formData} />;
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 1:
          return (
            <CampaignInfoStep
              nextStep={nextStep}
              tokenType={currentShopifyToken}
              updateFormData={updateFormData}
              initialData={formData.campaignInfo}
            />
          );
        case 2:
          return (
            <CreateContentStep
              nextStep={nextStep}
              prevStep={prevStep}
              shopifyProducts={shopifyProducts}
              updateFormData={updateFormData}
              initialData={formData.campaignInfo}
            />
          );
        case 3:
          return <ReviewCreateStep prevStep={prevStep} formData={formData} />;
        default:
          return null;
      }
    }
  };
  return (
    <section className="h-screen w-full overflow-hidden items-center justify-center">
      {/* <div className="flex items-center mb-4 h-20 bg-navBlue">
        <div className="flex flex-row text-start">
          <span className="lg:text-xl 2xl:text-2xl gap-2 text-lg text-white font-normal ml-10">
            Create Campaign
          </span>
        </div>
         <StepsComponent
          currentStep={currentStep}
          contentType={shopifyCampaign}
          completedSteps={completedSteps}
        /> 
      </div> */}
      <div className="flex flex-row items-centerh-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-10 border-b border-[#1C2437]/40">
        {/* <Link className="mx-auto" to={"/home"}>
          <img
            src={require("../assets/noBgLogo.png")}
            width={65}
            alt="logo"
            className="mt-2"
          />
        </Link> */}
        {/* <h3 className="2xl:text-3xl lg:text-2xl text-lg font-euclid font-normal text-left text-white mx-5"></h3> */}

        <div className="p-3 w-full">
          <StepsComponent
          currentStep={currentStep}
          contentType={shopifyCampaign}
          completedSteps={completedSteps}
        />
        </div>
        {/* <Link className="mx-10" to={"/home"}>
          <img
            src={require("../assets/noBgLogo.png")}
            width={65}
            alt="logo"
            className="mt-2"
          />
        </Link> */}
      </div>
      <div>{renderStep()}</div>
    </section>
  );
};

export default CreateCampaign;
