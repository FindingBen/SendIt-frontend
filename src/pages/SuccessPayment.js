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
  const [isSuccess, setIsSuccess] = useState();
  const [errMessage, setErrMessage] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    console.log(sessionId);
    if (sessionId) {
      paymentSuccessfull(sessionId);
    }
  }, [location.search, isSuccess]);

  const paymentSuccessfull = async (sessionId) => {
    try {
      let response = await axiosInstance.get(
        `/stripe/payment_successfull/${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      if (response.status === 200) {
        setIsSuccess(true);
        console.log("payment verified!");
      }
    } catch (error) {
      console.log(error.message);
      setErrMessage(error);
      setIsSuccess(false);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center h-100">
          {isSuccess ? (
            <h2 className="mt-10 text-center text-3xl font-bold text-gray-300">
              Payment successfull!<br></br>
              <h2>Enjoy sending</h2>
            </h2>
          ) : (
            <div>
              <h2 className="mt-10 text-center text-3xl font-bold text-gray-300">
                Looks like there was an error during payment
              </h2>
              <div
                class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 w-50"
                role="alert"
              >
                <span class="font-medium">Error!</span> {errMessage.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuccessPayment;
