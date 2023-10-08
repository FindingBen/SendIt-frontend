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
  console.log(loadingState);
  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <h3 class="text-3xl text-left font-extralight text-white/50">
              Package plans
            </h3>
            <div
              className="grid gap-6 lg:grid-cols-3 lg:gap-x-8 mt-3"
              style={{ width: "95%" }}
            >
              <div
                key={packagePlan[0]?.id}
                className="mb-6 lg:mb-0 rounded-md"
                style={{ backgroundColor: "#1118274D" }}
              >
                <div className="block w-full text-sm rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:placeholder-gray-400">
                  <div className="border-b-2 border-grayWhite border-opacity-70 p-6 text-center dark:border-opacity-40">
                    <p className="mb-4 text-2xl font-light uppercase text-grayWhite">
                      <strong>{packagePlan[0]?.plan_type}</strong>
                    </p>
                    <h3 className="mb-6 text-3xl text-white font-light">
                      <strong>$ {packagePlan[0]?.price}</strong>
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        stripeCheckout(
                          packagePlan[0]?.plan_type,
                          packagePlan[0]?.id
                        )
                      }
                      className="inline-block w-50 rounded text-white bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-800 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      value={0}
                      disabled={loadingState[packagePlan[0]?.id]}
                    >
                      {loadingState[packagePlan[0]?.id] ? (
                        <>
                          <svg
                            className="w-5 h-5 mx-auto animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
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
                  <div className="p-6 text-grayWhite">
                    <ol className="list-inside">
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[0]?.offer1}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[0]?.offer2}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        npm installation
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              {/* <!---!> */}
              <div
                key={packagePlan[1]?.id}
                className="mb-6 lg:mb-0 rounded-md"
                style={{ backgroundColor: "#1118274D" }}
              >
                <div className="block w-full text-sm rounded-lg cursor-pointer dark:placeholder-gray-400">
                  <div className="border-b-2 border-grayWhite border-opacity-70 p-6 text-center dark:border-opacity-40">
                    <p className="mb-4 text-grayWhite text-2xl font-light uppercase">
                      <strong>{packagePlan[1]?.plan_type}</strong>
                    </p>
                    <h3 className="mb-6 text-3xl font-light text-white">
                      <strong>$ {packagePlan[1]?.price}</strong>
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        stripeCheckout(
                          packagePlan[1]?.plan_type,
                          packagePlan[1]?.id
                        )
                      }
                      className="inline-block w-50 text-white rounded bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      value={1}
                      disabled={loadingState[packagePlan[1]?.id]}
                    >
                      {loadingState[packagePlan[1]?.id] ? (
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
                  <div className="p-6 text-grayWhite">
                    <ol className="list-inside">
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[1]?.offer1}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[1]?.offer2}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[1]?.offer3}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[1]?.offer4}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[1]?.offer5}
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              {/* .... */}
              <div
                key={packagePlan[2]?.id}
                className="mb-6 lg:mb-0 rounded-md"
                style={{ backgroundColor: "#1118274D" }}
              >
                <div className="block w-full text-sm dark:placeholder-gray-400">
                  <div className="border-b-2 border-grayWhite border-opacity-70 p-6 text-center dark:border-opacity-40">
                    <p className="mb-4 text-2xl font-light text-grayWhite uppercase">
                      <strong>{packagePlan[2]?.plan_type}</strong>
                    </p>
                    <h3 className="mb-6 text-3xl font-light text-white">
                      <strong>$ {packagePlan[2]?.price}</strong>
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        stripeCheckout(
                          packagePlan[2]?.plan_type,
                          packagePlan[2]?.id
                        )
                      }
                      className="inline-block w-50 rounded text-white bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      value={"2"}
                      disabled={loadingState[packagePlan[2]?.id]}
                    >
                      {loadingState[packagePlan[2]?.id] ? (
                        <>
                          <svg
                            className="w-5 h-5 mx-auto animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
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
                  <div className="p-6 text-grayWhite">
                    <ol className="list-inside">
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer1}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer2}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer3}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer4}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer5}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer6}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer7}
                      </li>
                      <li className="mb-4 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {packagePlan[2]?.offer8}
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagePlan;
