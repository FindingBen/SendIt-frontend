import React from "react";

const AnalyticsPage = () => {
  console.log("TEST");
  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row text-gray-300">
            <div
              className="border-solid border-1 border-gray-500 mt-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40" }}
            >
              <h1>Welcome to message analytics</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
