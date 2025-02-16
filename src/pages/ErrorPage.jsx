import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center antialiased bg-gradient-to-b from-lighterMainBlue to-mainBlue text-gray-200 min-h-screen p-4 w-100">
      <h1 className="text-3xl text-white">
        Opps something is wrong, contact administrator for further help.
      </h1>
    </div>
  );
};

export default ErrorPage;
