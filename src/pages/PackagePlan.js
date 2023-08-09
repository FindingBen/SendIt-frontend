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
        let filteredPackages = response.data.filter((item) => item.id !== 4);
        setPackage(filteredPackages);

        //setElements((prevItems) => prevItems.filter((item) => item !== element));
      }
    } catch (error) {
      console.error(error);
    }
  };

  let stripeCheckout = async (name_product) => {
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
      window.location.replace(response.data.url); // Log the response data
    } else {
      console.error("Error creating Stripe Checkout session");
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

  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="container my-10 mx-auto md:px-6">
              <section className="mb-10">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
                  Pricing
                </h2>
                <hr></hr>
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-8 mt-3">
                  <div key={packagePlan[0]?.id} className="mb-6 lg:mb-0">
                    <div className="block w-full text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-800 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                      <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-40">
                        <p className="mb-4 text-sm uppercase">
                          <strong>{packagePlan[0]?.plan_type}</strong>
                        </p>
                        <h3 className="mb-6 text-3xl">
                          <strong>$ {packagePlan[0]?.price}</strong>
                          <small className="text-base text-neutral-500 dark:text-neutral-300">
                            /month
                          </small>
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            stripeCheckout(packagePlan[0]?.plan_type)
                          }
                          className="inline-block w-50 rounded bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-800 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                          value={0}
                        >
                          Buy
                        </button>
                      </div>
                      <div className="p-6">
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
                  <div key={packagePlan[1]?.id} className="mb-6 lg:mb-0">
                    <div className="block w-full text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-800 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                      <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-40">
                        <p className="mb-4 text-sm uppercase">
                          <strong>{packagePlan[1]?.plan_type}</strong>
                        </p>
                        <h3 className="mb-6 text-3xl">
                          <strong>$ {packagePlan[1]?.price}</strong>
                          <small className="text-base text-neutral-500 dark:text-neutral-300">
                            /month
                          </small>
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            stripeCheckout(packagePlan[1]?.plan_type)
                          }
                          className="inline-block w-50 rounded bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                        >
                          Buy
                        </button>
                      </div>
                      <div className="p-6">
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
                  <div key={packagePlan[2]?.id} className="mb-6 lg:mb-0">
                    <div className="block w-full text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-800 dark:text-white-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                      <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-40">
                        <p className="mb-4 text-sm uppercase">
                          <strong>{packagePlan[2]?.plan_type}</strong>
                        </p>
                        <h3 className="mb-6 text-3xl">
                          <strong>$ {packagePlan[2]?.price}</strong>
                          <small className="text-base text-neutral-500 dark:text-neutral-300">
                            /month
                          </small>
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            stripeCheckout(packagePlan[2]?.plan_type)
                          }
                          className="inline-block w-50 rounded bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                        >
                          Buy
                        </button>
                      </div>
                      <div className="p-6">
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
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagePlan;
