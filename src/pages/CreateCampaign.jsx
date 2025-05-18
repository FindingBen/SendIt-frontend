import React, { useState, useEffect } from "react";
import StepsComponent from "../components/StepsComponent/StepsComponent";
import CampaignInfoStep from "../components/StepsComponent/CampaignInfoStep";
import CreateContentStep from "../components/StepsComponent/CreateContentStep";
import ShopifyProductsCampaignBuilder from "../components/StepsComponent/ShopifyProductsCampaignBuilder";
import ReviewCreateStep from "../components/StepsComponent/ReviewCreateStep";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";

const CreateCampaign = () => {
  const axiosInstance = useAxiosInstance();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [completedSteps, setCompletedSteps] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [shopifyCampaign, setShopifyCampaign] = useState(false);
  const [callShopify, setCallShopify] = useState(false);
  const [formData, setFormData] = useState({
    campaignInfo: {},
    contentElements: [],
    sendingOptions: {},
  }); // Store data from all steps
  const { currentShopifyToken } = useRedux();

  useEffect(() => {
    if (currentShopifyToken && setCallShopify) {
      fetchShopify();
    }
  }, [setCallShopify]);

  useEffect(() => {
    if (formData.campaignInfo.campaignContent === "Shopify") {
      setShopifyCampaign(true);
      console.log("ssss");
    }
  }, [formData]);

  const updateFormData = (stepData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
  };
  console.log(shopifyCampaign);
  const handleShopifyCall = (value) => {
    setCallShopify(value);
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
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 3)); // Ensure it doesn't exceed the total steps
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  console.log(formData);
  const fetchShopify = async () => {
    try {
      let response = await axiosInstance.get("/api/shopify_products/");

      if (response.status === 200) {
        console.log(response.data);

        const products = response.data.map((item) => ({
          id: item.node.id,
          title: item.node.title,
          description: item.node.descriptionHtml,
          createdAt: item.node.createdAt,
          image: item.node.images.edges[0],
        }));

        setShopifyProducts(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderStep = () => {
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
        return shopifyCampaign ? (
          <ShopifyProductsCampaignBuilder
            shopifyProducts={shopifyProducts}
            nextStep={nextStep}
            prevStep={prevStep}
            initialData={formData.contentElements}
            updateFormData={updateFormData}
            apiCall={handleShopifyCall}
          />
        ) : (
          <CreateContentStep
            nextStep={nextStep}
            prevStep={prevStep}
            shopifyProducts={shopifyProducts}
            updateFormData={updateFormData}
            initialData={formData.contentElements}
          />
        );

      case 3:
        return <ReviewCreateStep prevStep={prevStep} formData={formData} />;
      default:
        return null;
    }
  };
  return (
    <section className="h-screen w-full overflow-hidden items-center justify-center">
      <div className="flex items-center mb-4 h-20 bg-navBlue">
        <div className="flex flex-row text-start">
          <span className="lg:text-xl 2xl:text-2xl gap-4 text-lg text-white font-semibold ml-20">
            Create Campaign
          </span>
        </div>
        <div className="ml-[12%] w-full">
          <StepsComponent
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>
      <hr className="text-white/50"></hr>
      <div>{renderStep()}</div>
    </section>
  );
};

export default CreateCampaign;
