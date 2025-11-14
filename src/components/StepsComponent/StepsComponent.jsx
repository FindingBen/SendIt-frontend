import React from "react";

const StepsComponent = ({
  currentStep = 1,
  setCurrentStep = () => {},
  completedSteps = [],
  contentType = false,
}) => {
  const steps = contentType
    ? [
        { id: 1, label: "Campaign Info" },
        { id: 2, label: "Products" },
        { id: 3, label: "Content" },
        { id: 4, label: "Review" },
      ]
    : [
        { id: 1, label: "Campaign Info" },
        { id: 2, label: "Content" },
        { id: 3, label: "Review" },
      ];

  return (
    <div className="flex items-center w-full px-4 select-none">
      {steps.map((step, index) => {
        const isCompleted =
          Array.isArray(completedSteps) &&
          completedSteps.includes(step.id) &&
          step.id < currentStep;
        const isActive = currentStep === step.id;
        const showConnector = index < (steps?.length || 0) - 1;

        return (
          <div key={step.id} className="flex items-center w-full">
            {/* Step pill */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setCurrentStep(step.id)}
              onKeyDown={(e) => e.key === "Enter" && setCurrentStep(step.id)}
              className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all duration-300 cursor-pointer select-none
                ${
                  isCompleted
                    ? "bg-[#4937BA] text-white scale-95 shadow-[0_6px_18px_rgba(73,55,186,0.18)]"
                    : isActive
                    ? "bg-gradient-to-b from-[#3e6ff4] to-[#4937BA] text-white scale-105 shadow-[0_8px_24px_rgba(62,111,244,0.18)]"
                    : "bg-[#1f2937] text-gray-300 hover:text-white hover:bg-[#2a3348]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Icon / Number */}
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}

                {/* Label */}
                <span className="text-sm font-medium whitespace-nowrap">
                  {step.label}
                </span>
              </div>
            </div>

            {/* Connector */}
            {showConnector && (
              <div className="flex-1 h-[2px] mx-3 rounded-full bg-gradient-to-r from-[#1f2937] via-[#2a3348] to-[#3e6ff4] opacity-40" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepsComponent;
