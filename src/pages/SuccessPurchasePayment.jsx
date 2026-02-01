import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion-3d";
import { useRedux } from "../constants/reduxImports";
import { setPackage } from "../redux/reducers/packageReducer";
import ReceiptPurchaseComponent from "../components/ReceiptPurchaseComponent";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";


const SuccessPurchasePayment = () => {
      const { dispatch } = useRedux();
      const axiosInstance = useAxiosInstance();
      const location = useLocation();

      const [isSuccess, setIsSuccess] = useState(null); // null = loading
        const [showModal, setShow] = useState(false);
        const [purchase, setPurchase] = useState({});
        const [loaded, setLoaded] = useState(false);
        const [errMessage, setErrMessage] = useState("");
        

          useEffect(() => {
            const params = new URLSearchParams(location.search);
            const sessionId = params.get("session_id");
        
            if (sessionId) {
              paymentSuccessfull(sessionId);
            }
        
            return () => {
              setLoaded(false);
            };
          }, [location.search]);

          const paymentSuccessfull = async (sessionId) => {
            setShow(true);
            try {
              const response = await axiosInstance.post(
                `/stripe/payment_successfull?session_id=${sessionId}`,
                {
                  session_id: sessionId,
                }
              );
              
              if (response.status === 200) {
                console.log(response);
                setTimeout(() => setShow(false), 2000);
        
                const package_payload = {
                 
                  sms_count: response?.data.user.package_plan.sms_count_pack,
                };
        
                dispatch(setPackage(package_payload));
                
                setPurchase(response?.data.purchase);
                setLoaded(true);
                setIsSuccess(true);
              }
            } catch (error) {
              console.error("Error during payment success:", error);
              setShow(false);
              setErrMessage(error);
              setIsSuccess(false);
            }
          };
  
      const renderContent = () => {
        if (isSuccess === null) {
          return (
            <h2 className="mt-10 flex flex-col text-3xl font-light text-grayWhite">
              Confirming the payment...
            </h2>
          );
        }
    
        if (isSuccess) {
          return (
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
              <span className="text-3xl font-semibold">Payment successful!</span>
              <br />
              <div className="flex justify-center mt-5 text-normal">
                {/* {loaded && (
                  <ReceiptComponent
                    purchase_obj={purchase}
                    packageObj={packageObj}
                  />
                )} */}
                <ReceiptPurchaseComponent purchase_obj={purchase} />
              </div>
            </motion.div>
          );
        }
    
        return (
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
            <div className="flex flex-col justify-center mb-4 mt-5 mx-auto h-28 opacity-80 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 w-50">
              <span className="font-medium">Error!</span> {errMessage.message}
              <span className="font-medium">
                Please contact support so we can assist you with this.
              </span>
            </div>
          </motion.div>
        );
      };
    
      return (
        <section className="min-h-screen w-full flex flex-col">
          <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
            <Search />
            <SmsPill />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col py-8">
              <div className="px-2 sm:px-0 xl:px-0 mx-20">
                {renderContent()}
              </div>
            </div>
          </div>
          <ModalComponent
            modalType={"Payment_Confirmation"}
            showModal={showModal}
          />
        </section>
      );
}

export default SuccessPurchasePayment