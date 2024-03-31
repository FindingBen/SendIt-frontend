import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion-3d";
import { useRedux } from "../constants/reduxImports";
import { setPackage } from "../redux/reducers/packageReducer";
import ReceiptComponent from "../components/ReceiptComponent";

const SuccessPayment = () => {
  const { dispatch } = useRedux();
  const axiosInstance = useAxiosInstance();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(0);
  const [showModal, setShow] = useState(false);
  const [purchase, setPurchase] = useState({});
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      paymentSuccessfull(sessionId);
    }
  }, [location.search, isSuccess]);

  const paymentSuccessfull = async (sessionId) => {
    setShow(true);
    try {
      let response = await axiosInstance.get(
        `/stripe/payment_successfull/${sessionId}`
      );
      if (response.status === 200) {
        setTimeout(() => setShow(false), 1000);

        dispatch(
          setPackage({
            package_plan: response?.data.user.package_plan.plan_type,
          })
        );
        setPurchase(response?.data.purchase);
        if (showModal === false) {
          setIsSuccess(true);
        }
      }
    } catch (error) {
      setShow(false);
      setErrMessage(error);
      setIsSuccess(false);
    }
  };

  return (
    <section className="min-h-screen flex-d w-full items-center justify-center">
      <div className="flex-1 flex flex-col mb-4 h-20 bg-black border-l border-white">
        <div className="flex-1 px-2 sm:px-0 xl:px-0 mx-20">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: [0, 0.41, 0.1, 1.01],
              }}
              className="mt-10 text-center font-light text-grayWhite"
            >
              <span className="text-3xl">Payment successful!</span>
              <br></br>
              <div className="flex justify-center mt-5 text-normal">
                <ReceiptComponent purchase_obj={purchase} />
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
      <ModalComponent
        modalType={"Payment_Confirmation"}
        showModal={showModal}
      />
    </section>
  );
};

export default SuccessPayment;
