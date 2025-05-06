import React from "react";

const StepsComponent = ({ currentStep, completedSteps }) => {
  const steps = [
    { id: 1, label: "Campaign Info" },
    { id: 2, label: "Content" },
    { id: 3, label: "Sending options" },
    { id: 4, label: "Review & Create" },
  ];

  return (
    <ol className="flex flex-row items-center justify-between text-gray-400 mt-3">
      {steps.map((step) => (
        <li key={step.id} className="flex flex-col items-center mx-5">
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-gray-900 ${
              completedSteps.includes(step.id)
                ? "bg-green-200 dark:bg-green-900"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {completedSteps.includes(step.id) ? (
              <svg
                className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
              </svg>
            )}
          </span>
          <h3 className="font-medium leading-tight mt-2">{step.label}</h3>
        </li>
      ))}
    </ol>
  );
};

export default StepsComponent;
