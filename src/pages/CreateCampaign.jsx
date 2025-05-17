import React, { useState, useEffect } from "react";
import StepsComponent from "../components/StepsComponent/StepsComponent";
import CampaignInfoStep from "../components/StepsComponent/CampaignInfoStep";
import CreateContentStep from "../components/StepsComponent/CreateContentStep";
import RecipientsStep from "../components/StepsComponent/RecipientsStep";
import ReviewCreateStep from "../components/StepsComponent/ReviewCreateStep";

const CreateCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    campaignInfo: {},
    contentElements: [],
    sendingOptions: {},
  }); // Store data from all steps
  const updateFormData = (stepData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
  };
  console.log(formData);
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

  const handleSubmit = () => {
    console.log("Final Campaign Data:", formData);
    // Add API call to create the campaign here
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CampaignInfoStep
            nextStep={nextStep}
            updateFormData={updateFormData}
            initialData={formData.campaignInfo}
          />
        );
      case 2:
        return (
          <CreateContentStep
            nextStep={nextStep}
            prevStep={prevStep}
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
