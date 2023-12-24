import React, { useState } from "react";
import { useRedux } from "../../constants/reduxImports";
import useAxiosInstance from "../../utils/axiosInstance";
import ModalComponent from "../ModalComponent";
const Plans = ({ packagePlan }) => {
  const { currentUser, dispatch, currentToken } = useRedux();
  const axiosInstance = useAxiosInstance();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loadingState, setLoadingStates] = useState({});

  let stripeCheckout = async (name_product, id) => {
    setShow(true);
    setLoadingStates((prevState) => ({
      ...prevState,
      [id]: true,
    }));
    setIsLoading(true);

    let response = await axiosInstance.post("/stripe/stripe_checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(currentToken),
      },
      name_product,
      currentUser,
    });
    if (response.status === 200) {
      console.log(response);

      setLoadingStates((prevState) => ({
        ...prevState,
        [id]: false,
      }));
      setShow(false);
      window.location.replace(response.data.url);
      // Log the response data
    } else {
      console.error("Error creating Stripe Checkout session");
      setIsLoading(false);
      setShow(false);
    }
  };

  const elementsArray = Array.from(
    { length: packagePlan.length },
    (_, index) => index
  );
  console.log(packagePlan);
  return (
    <div className="flex-1 items-center justify-center">
      <div className="flex flex-col gap-8 p-10 lg:flex-row xl:flex-row">
        {elementsArray?.map((plan, index) => (
          <div
            key={packagePlan[index]?.id}
            value={index}
            disabled={loadingState[packagePlan[index]?.id]}
            onClick={() =>
              stripeCheckout(
                packagePlan[index]?.plan_type,
                packagePlan[index]?.id
              )
            }
            className={`flex flex-col ${
              loadingState[packagePlan[index]?.id]
                ? "opacity-75"
                : "opacity-100"
            } max-h-[428px] w-[260px] rounded-3xl p-8 transition ${
              {
                "Gold plan": "bg-yellow-700",
                "Silver Plan": "bg-slate-600/50",
                "Basic Plan": "bg-green-400",
              }[packagePlan[index]?.plan_type] || "bg-gray-700/50"
            } ease-in-out delay-90 hover:text-gradient hover:-translate-y-1 hover:scale-110 hover:bg-gray-900/80 duration-300 cursor-pointer`}
          >
            <h2 className="mb-5 text-xl font-poppins text-white">
              {packagePlan[index]?.plan_type}
            </h2>
            <div className="mb-3 flex flex-row text-white">
              <button
                value={index}
                onClick={() =>
                  stripeCheckout(
                    packagePlan[index]?.plan_type,
                    packagePlan[index]?.id
                  )
                }
                className="px-3 py-2 rounded-full bg-gray-900/50 hover:bg-gray-50 hover:text-black duration-300"
              >
                {loadingState[packagePlan[index]?.id] ? (
                  <>
                    <svg
                      className="w-5 h-5 mx-auto animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  "Buy"
                )}
              </button>
              <p className="text-5xl mx-auto font-normal">
                {packagePlan[index]?.price + "kr"}
              </p>
            </div>
            <ul role="list" class="mb-8 space-y-4 text-left text-white">
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer1 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400 bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span> {packagePlan[index]?.offer1}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer2 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green- bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer2}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer3 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green- bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer3}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer4 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green- bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer4}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer5 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400 bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer5}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer6 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400 bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer6}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer7 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400 bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer7}</span>
              </li>
              <li class="flex items-center space-x-3">
                {packagePlan[index]?.offer8 ? (
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400 bg-gray-50 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <p></p>
                )}
                <span>{packagePlan[index]?.offer8}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
      <ModalComponent modalType={"Redirect"} showModal={show}></ModalComponent>
    </div>
  );
};

export default Plans;
