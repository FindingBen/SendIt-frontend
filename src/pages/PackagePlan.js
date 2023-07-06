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
      console.log(response);
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
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div class="container my-10 mx-auto md:px-6">
              <section class="mb-10">
                <h2 class="mb-6 text-center text-3xl font-bold">
                  Pricing(to be added)
                </h2>

                <div class="grid gap-6 lg:grid-cols-3 lg:gap-x-8">
                  {packagePlan?.map((plan) => (
                    <div class="mb-6 lg:mb-0">
                      <div class="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                        <div class="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-10">
                          <p class="mb-4 text-sm uppercase">
                            <strong>{plan.plan_type}</strong>
                          </p>
                          <h3 class="mb-6 text-3xl">
                            <strong>$ {plan.price}</strong>
                            <small class="text-base text-neutral-500 dark:text-neutral-300">
                              /month
                            </small>
                          </h3>

                          <button
                            type="button"
                            class="inline-block w-full rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                          >
                            Buy
                          </button>
                        </div>
                        <div class="p-6">
                          <ol class="list-inside">
                            <li class="mb-4 flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5"
                                />
                              </svg>
                              Unlimited updates
                            </li>
                            <li class="mb-4 flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5"
                                />
                              </svg>
                              Git repository
                            </li>
                            <li class="mb-4 flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="mr-3 h-5 w-5 text-primary dark:text-primary-400"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
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
