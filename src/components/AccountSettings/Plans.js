import React, { useState, useEffect } from "react";
import { useRedux } from "../../constants/reduxImports";
import { useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../../utils/axiosInstance";
import ModalComponent from "../ModalComponent";
import SmsPill from "../SmsPill/SmsPill";

const Plans = () => {
  const { currentUser, dispatch, currentToken } = useRedux();
  const axiosInstance = useAxiosInstance();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loadingState, setLoadingStates] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [calculatedPackage, setCalculatedPackage] = useState(null);
  const [budget, setBudget] = useState("");
  const [recipients, setRecipients] = useState("");
  const [messages, setMessages] = useState("");
  const [packagePlan, setPackages] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getPackages();
  }, []);

  let stripeCheckout = async (name_product, id) => {
    try {
      setShow(true);
      setLoadingStates((prevState) => ({
        ...prevState,
        [id]: true,
      }));
      setIsLoading(true);

      let response = await axiosInstance.post(
        "/stripe/stripe_checkout_session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(currentToken),
          },
          name_product,
          currentUser,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setLoadingStates((prevState) => ({
          ...prevState,
          [id]: false,
        }));
        setShow(false);
        window.location.replace(response.data.url);
        // Log the response data
        // } else {
        //   console.error("Error creating Stripe Checkout session");
        //   setIsLoading(false);
        //   setShow(false);
        // }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setShow(false);
    }
  };

  let getPackages = async () => {
    try {
      let response = await axiosInstance.get("/api/package_plan/");

      if (response.status === 200) {
        let filteredPackages = response.data.filter((item) => item.id !== 1);

        setPackages(filteredPackages);
      }
    } catch (error) {
      setIsLoading(true);
      console.error(error);
    }
  };

  const handleMessagesCount = (e) => {
    setMessages(e.target.value);
  };

  const handleRecipientsCount = (e) => {
    setRecipients(e.target.value);
  };

  const handleBudgetValue = (e) => {
    setBudget(e.target.value);
  };

  const calculatePackage = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/stripe/calculate_plan/", {
        messages_count: messages,
        customers_count: recipients,
        budget: budget, // You might want to add a budget input field
      });

      if (response.status === 200) {
        setCalculatedPackage(response.data.recommended_package);
        setIsLoading(false);
      } else {
        console.error("Error calculating plan usage");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error calculating plan usage", error);
      setIsLoading(false);
    }
  };

  const elementsArray = Array.from(
    { length: packagePlan.length },
    (_, index) => index
  );

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
        <Link to={"/welcome"}>
          <img
            src={require("../../assets/noBgLogo.png")}
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
      <div className="flex-1 items-center justify-center mx-44">
        <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
          <h3 class="xl:text-2xl lg:text-xl text-normal font-euclid text-left text-white mx-20">
            Package plans
          </h3>
        </div>
        <div className="flex flex-row gap-8 p-10 lg:flex-row xl:flex-row relative mx-20">
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
              } max-h-[428px] w-[260px] rounded-3xl p-8 transition ease-in-out delay-90 bg-gradient-to-b from-lighterMainBlue to-mainBlue hover:text-gradient hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer ${
                packagePlan[index]?.plan_type === "Gold package"
                  ? "hover:bg-yellow-700"
                  : packagePlan[index]?.plan_type === "Silver package"
                  ? "hover:bg-slate-600/50"
                  : packagePlan[index]?.plan_type === "Basic package"
                  ? "hover:bg-green-400"
                  : "bg-gray-900"
              }`}
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

          {/* <div
            className={`absolute top-10 -right-6 h-[428px] w-[260px] bg-slate-800 rounded-3xl`}
          >
            <div className="flex flex-col p-4">
              <label
                for="first_name"
                className="block mb-2 text-sm text-left font-normal text-gray-300 dark:text-white"
              >
                How much is your budget per month?
              </label>
              <input
                type="text"
                id="first_name"
                onChange={handleBudgetValue}
                className="block bg-white duration-200 text-black font-light py-2 px-4 rounded-md"
                placeholder="For ex 1000 dkk a month"
              />
              <label
                for="first_name"
                className="block mb-2 mt-2 text-sm text-left font-normal text-gray-300 dark:text-white"
              >
                How many recipients do you have?
              </label>
              <input
                onChange={handleRecipientsCount}
                type="text"
                id="first_name"
                className="block bg-white duration-200 text-black font-light py-2 px-4 rounded-md"
              />
              <label
                for="first_name"
                className="block mb-2 mt-2 text-sm text-left font-normal text-gray-300 dark:text-white"
              >
                How many messages per month do you excpect to send?
              </label>
              <input
                onChange={handleMessagesCount}
                type="text"
                id="first_name"
                className="block bg-white duration-200 text-black font-light py-2 px-4 rounded-md"
              />
              <button
                onClick={calculatePackage}
                className="bg-cyan-600 hover:bg-cyan-400 duration-300 text-white font-normal mt-2 py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
              >
                {loadingState ? "Calculate" : "Calculating.."}
              </button>
              {calculatedPackage && (
                <p className="text-white font-light">
                  Best package for you is <br />
                  <b>{calculatedPackage}</b>
                </p>
              )}
            </div>
          </div> */}
        </div>

        <ModalComponent
          modalType={"Redirect"}
          showModal={show}
        ></ModalComponent>
      </div>
    </section>
  );
};

export default Plans;
