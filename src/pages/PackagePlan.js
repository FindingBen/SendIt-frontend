import React, { useEffect, useState } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import SuccessPayment from "./SuccessPayment";

const PackagePlan = () => {
  const axiosInstance = useAxiosInstance();
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingStates] = useState({});
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [packagePlan, setPackage] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const values = location.search;
    console.log(values);
    getPackages();
  }, []);

  let getPackages = async () => {
    try {
      let response = await axiosInstance.get("/api/package_plan/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });

      if (response.status === 200) {
        console.log(response);
        let filteredPackages = response.data.filter((item) => item.id !== 1);

        setPackage(filteredPackages);

        //setElements((prevItems) => prevItems.filter((item) => item !== element));
      }
    } catch (error) {
      console.error(error);
    }
  };

  let stripeCheckout = async (name_product, id) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      [id]: true,
    }));
    setIsLoading(true);
    console.log(name_product, id);
    let response = await axiosInstance.post("/stripe/stripe_checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token),
      },
      name_product,
      user,
    });
    if (response.status === 200) {
      //let data = await response.json();
      console.log(response);

      setLoadingStates((prevState) => ({
        ...prevState,
        [id]: false,
      }));

      window.location.replace(response.data.url); // Log the response data
    } else {
      console.error("Error creating Stripe Checkout session");
      setIsLoading(false);
    }
  };

  let buyPackage = async (id) => {
    console.log(id);
    const formData = {};
    //e.preventDefault();
    let response = await axiosInstance.put(
      `/api/package_purchase/${user}/`,
      {
        package_plan: id,
      },
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );

    if (response.status === 200) {
      //navigate("/home");
    }
  };
  const elementsArray = Array.from(
    { length: packagePlan.length },
    (_, index) => index
  );
  return (
    <section className="min-h-screen flex-d items-center justify-center">
      <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <h3 class="xl:text-3xl text-2xl text-left font-extralight text-white/50">
              Package plans
            </h3>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-8 mt-3">
              {elementsArray?.map((index) => (
                <div
                  key={packagePlan[index]?.id}
                  class="flex flex-col px-5 mx-auto max-w-lg text-center text-white bg-gray-900 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 "
                >
                  <h3 class="mb-4 text-xl xl:text-2xl font-semibold mt-3">
                    {packagePlan[index]?.plan_type}
                  </h3>
                  <p class="font-light text-gray-500 text-base">
                    Most optimal for starter individuals and startups.
                  </p>
                  <div class="flex justify-center items-baseline my-8">
                    <span class="mr-2 xl:text-5xl text-4xl font-extrabold">
                      $ {packagePlan[index]?.price}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">/month</span>
                  </div>

                  <ul role="list" class="mb-8 space-y-4 text-left">
                    <li class="flex items-center space-x-3">
                      {packagePlan[index]?.offer1 ? (
                        <svg
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                          class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
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
                  <button
                    type="button"
                    onClick={() =>
                      stripeCheckout(
                        packagePlan[index]?.plan_type,
                        packagePlan[index]?.id
                      )
                    }
                    className="xl:w-50 text-white rounded bg-blue-500 px-6 pt-2.5 pb-2 mb-3 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    value={index}
                    disabled={loadingState[packagePlan[index]?.id]}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagePlan;
