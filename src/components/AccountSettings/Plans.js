import React, { useState, useEffect } from "react";
import { useRedux } from "../../constants/reduxImports";
import { useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../../utils/axiosInstance";
import ModalComponent from "../ModalComponent";
import SmsPill from "../SmsPill/SmsPill";
import Search from "../SearchComponent/Search";

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

  const elementsArray = Array.from(
    { length: packagePlan.length },
    (_, index) => index
  );
  console.log(packagePlan);

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-16 bg-navBlue sticky top-0 z-10">
        <Search />

        <SmsPill />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6 mx-44">
            <h3 className="xl:text-2xl lg:text-xl text-normal font-euclid text-left text-white">
              Package plans
            </h3>
          </div>

          <div className="flex justify-center mx-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {elementsArray?.map((plan, index) => {
                const currentPlan = packagePlan[index];
                const isLoading = loadingState[currentPlan?.id];

                return (
                  <div
                    key={currentPlan?.id}
                    onClick={() =>
                      stripeCheckout(currentPlan?.plan_type, currentPlan?.id)
                    }
                    className={`flex flex-col justify-between bg-ngrokGray p-6 rounded-3xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 cursor-pointer border-2 ${
                      currentPlan?.plan_type === "Gold package"
                        ? "border-yellow-500"
                        : currentPlan?.plan_type === "Silver package"
                        ? "border-gray-400"
                        : "border-green-400"
                    } ${isLoading ? "opacity-70" : "opacity-100"}`}
                  >
                    <div>
                      <h2 className="text-white text-xl font-semibold mb-4">
                        {currentPlan?.plan_type}
                      </h2>

                      <div className="flex items-center justify-between mb-6">
                        <button
                          disabled={isLoading}
                          className="px-4 py-2 bg-purpleHaze text-white rounded-full text-sm hover:bg-ngrokBlue transition-colors"
                        >
                          {isLoading ? (
                            <svg
                              className="w-5 h-5 animate-spin mx-auto"
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
                                d="M4 12a8 8 0 018-8V0C5.372 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          ) : (
                            "Buy"
                          )}
                        </button>

                        <p className="text-3xl font-bold text-white">
                          {currentPlan?.price} kr
                        </p>
                      </div>

                      <ul className="text-sm text-white space-y-3">
                        {[...Array(8)].map((_, i) => {
                          const offer = currentPlan?.[`offer${i + 1}`];
                          return (
                            offer && (
                              <li
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <svg
                                  className="w-4 h-4 text-green-400 bg-white rounded-full"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                <span>{offer}</span>
                              </li>
                            )
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <ModalComponent modalType={"Redirect"} showModal={show} />
      </div>
    </section>
  );
};

export default Plans;
