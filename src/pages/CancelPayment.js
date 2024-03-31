import React from "react";
import { Link } from "react-router-dom";

const CancelPayment = () => {
  return (
    <section className="vh-100 w-100">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center mb-4 h-20 bg-black border-l border-white">
          <h2 className="text-center text-3xl text-grayWhite">
            Payment has been cancelled <br></br>
          </h2>
        </div>
        <Link
          to={"/plans"}
          className="text-white hover:text-blue-500 cursor-pointer"
        >
          Back to Packages
        </Link>
      </div>
    </section>
  );
};

export default CancelPayment;
