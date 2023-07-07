import React, { useEffect, useState } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";

const PackagePlan = () => {
  const axiosInstance = useAxiosInstance();
  const params = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const [packagePlan, setPackage] = useState([]);

  useEffect(() => {
    getPackages();
  }, []);

  let getPackages = async () => {
    try {
      let response = await axiosInstance.get(
        "http://127.0.0.1:8000/api/package_plan/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (response.status === 200) {
        setPackage(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="container my-10 mx-auto md:px-6">
              <section className="mb-10">
                <h2 className="mb-6 text-center text-3xl font-bold">
                  Pricing(to be added)
                </h2>

                <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-8">
                  {packagePlan?.map((plan) => (
                    <div key={plan.id} className="mb-6 lg:mb-0">
                      <div className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                        <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-40">
                          <p className="mb-4 text-sm uppercase">
                            <strong>{plan.plan_type}</strong>
                          </p>
                          <h3 className="mb-6 text-3xl">
                            <strong>$ {plan.price}</strong>
                            <small className="text-base text-neutral-500 dark:text-neutral-300">
                              /month
                            </small>
                          </h3>

                          <button
                            type="button"
                            className="inline-block w-full rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
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
                              Unlimited updates
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
                              Git repository
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
                  ))}
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
