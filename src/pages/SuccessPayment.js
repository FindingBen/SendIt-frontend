import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion-3d";

const SuccessPayment = () => {
  const axiosInstance = useAxiosInstance();
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const [isSuccess, setIsSuccess] = useState(0);

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

  const paymentCancelled = async () => {
    try {
      let response = await axiosInstance.get(`/stripe/payment_cancelled`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });
      if (response.status === 200) {
        setIsSuccess(false);
        console.log("payment cancelled!");
      }
    } catch (error) {
      console.log(error.message);
      setErrMessage(error);
      setIsSuccess();
    }
  };

  return (
    <section className="min-h-screen flex-d w-full items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0 xl:px-0">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="mt-10 text-center text-3xl font-light text-grayWhite"
            >
              Payment successful!<br></br>
              <p className="p-2 text-poppins text-normal">
                Thank you for your purchase, happy sending!
              </p>
              <div className="flex justify-center mt-5">
                <img
                  src={require("../../src/assets/check.png")}
                  height={150}
                  width={150}
                  alt="Checkmark"
                ></img>
              </div>
            </motion.div>
          ) : isSuccess === false ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="mt-10 flex flex-col text-3xl font-light text-grayWhite"
            >
              Process got cancelled
              <div class="flex flex-col justify-center mb-4 mt-5 mx-auto h-28 opacity-80 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 w-50">
                <span class="font-medium">Error!</span> {errMessage.message}
                <span class="font-medium">
                  Please contact the support so we can assist you with this.
                </span>
              </div>
            </motion.div>
          ) : (
            <h2 className="mt-10 flex flex-col text-3xl font-light text-grayWhite">
              Confirming the payment...
            </h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuccessPayment;
