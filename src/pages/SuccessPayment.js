import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";

const SuccessPayment = () => {
  const axiosInstance = useAxiosInstance();
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      paymentSuccessfull(sessionId);
    }
  }, [location.search]);
  console.log(token);
  const paymentSuccessfull = async (sessionId) => {
    let response = await axiosInstance.get(
      `http://localhost:8000/api/stripe/payment_successfull/${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    if (response.status === 200) {
      console.log("payment verified!");
    }
    console.log(response);
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <h2 className="mt-10 text-center text-3xl font-bold text-gray-800">
            Payment successfull!<br></br>
            <h2>Enjoy sending</h2>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SuccessPayment;
