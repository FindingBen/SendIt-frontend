export default function ShopifyIntegrationStatus({
  hasImportedCustomers,
  hasImportedProducts,
  hasRuleset,
}) {
  const steps = [
    {
      label: "Import Shopify Contacts",
      done: hasImportedCustomers,
    },
    {
      label: "Import Shopify Products",
      done: hasImportedProducts,
    },
    {
      label: "Generate SEO Ruleset",
      done: hasRuleset,
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="relative bg-[#0F1724] rounded-2xl p-4 shadow-sm">

      {/* Tooltip Button */}
      <div className="absolute top-3 left-3 group">
        <button
          className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-700 text-gray-200 text-xs hover:bg-gray-600 transition"
        >
          ?
        </button>

        {/* Tooltip */}
        <div className="absolute z-20 hidden group-hover:block w-64 p-3 bg-black/80 text-gray-200 text-xs rounded-lg shadow-xl backdrop-blur-md -left-1 top-7">
          <p>
            This section shows the status of your Shopify integration.  
            Complete each step to fully sync your Shopify store with Sendplane.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-100 pl-8">Shopify Integration Status</h3>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-[#1A2433] rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-400 mt-2">
        {percent === 100
          ? "Your Shopify store is fully integrated!"
          : `Integration is ${percent}% complete.`}
      </p>

      {/* Steps */}
      <div className="mt-5 space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{step.label}</span>
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                step.done ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              {step.done ? (
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
