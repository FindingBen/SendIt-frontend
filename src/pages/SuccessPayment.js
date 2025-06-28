import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion-3d";
import { useRedux } from "../constants/reduxImports";
import { setPackage } from "../redux/reducers/packageReducer";
import ReceiptComponent from "../components/ReceiptComponent";
import SmsPill from "../components/SmsPill/SmsPill";

const SuccessPayment = () => {
  const { dispatch } = useRedux();
  const axiosInstance = useAxiosInstance();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShow] = useState(false);
  const [purchase, setPurchase] = useState({});
  const [packageObj, setPackageObj] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      paymentSuccessfull(sessionId);
    }

    return () => {
      setLoaded(false);
    };
  }, [location.search, isSuccess]);

  const paymentSuccessfull = async (sessionId) => {
    setShow(true);

    try {
      let response = await axiosInstance.get(
        `/stripe/payment_successfull/${sessionId}`
      );
      if (response.status === 200) {
        setTimeout(() => setShow(false), 2000);
        console.log(response);
        const package_payload = {
          package_plan: response?.data.user.package_plan.plan_type,
          sms_count:
            response?.data.user.sms_count +
            response?.data.user.package_plan.sms_count_pack,
        };
        console.log(package_payload);
        dispatch(setPackage(package_payload));
        setPackageObj(package_payload);
        setPurchase(response?.data.purchase);
        setLoaded(true);
        if (showModal === false) {
          setIsSuccess(true);
          // setPurchase({}); // Reset purchase state
          // setIsSuccess(null);
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
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
        <Link to={"/welcome"}>
          <img
            src={require("../assets/noBgLogo.png")}
            width={65}
            alt="logo"
            className="mt-2"
          />
        </Link>
        <h3 className="2xl:text-3xl lg:text-2xl text-lg font-normal text-left font-euclid text-white mx-5">
          Sendperplane
        </h3>

        <div class="relative">
          {searchValue === "" && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          )}
          <input
            type="search"
            id="default-search"
            class="block w-full p-2 ps-10 text-sm text-gray-100 border-2 border-gray-700 rounded-lg bg-ngrokGray"
            required
          />
        </div>

        <SmsPill />
      </div>
      <div className="flex-1 flex flex-col mb-4 h-20">
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
              className="mt-10 text-center font-light text-white"
            >
              <span className="text-3xl font-semibold">
                Payment successful!
              </span>
              <br></br>
              <div className="flex justify-center mt-5 text-normal">
                {loaded && (
                  <ReceiptComponent
                    purchase_obj={purchase}
                    packageObj={packageObj}
                  />
                )}
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
