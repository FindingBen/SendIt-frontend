import React, { useState, useEffect } from "react";
import { useRedux } from "../../constants/reduxImports";
import useAxiosInstance from "../../utils/axiosInstance";
import ModalComponent from "../ModalComponent";
import SmsPill from "../SmsPill/SmsPill";
import Search from "../SearchComponent/Search";

const Plans = () => {
  const { currentUser, currentDomain, currentToken } = useRedux();
  const axiosInstance = useAxiosInstance();

  const [show, setShow] = useState(false);
  const [loadingState, setLoadingStates] = useState({});
  const [packagePlan, setPackages] = useState([]);
  const [isShopifyUser, setIsShopifyUser] = useState(false);

  const topUps = [
    { name: "200 SMS", price: "2.00", description: "200 sms" },
    { name: "1000 SMS", price: "20.00", description: "1000 sms" },
    { name: "5000 SMS", price: "80.00", description: "5000 sms" },
  ];

  useEffect(() => {
    getPackages();
    checkShopifyUser();
  }, []);

  const checkShopifyUser = async () => {
    try {
      const response = await axiosInstance.get("/stripe/shopify_status/");
      setIsShopifyUser(response.data.is_shopify);
    } catch (error) {
      console.error("Error checking Shopify user", error);
    }
  };

  const getPackages = async () => {
    try {
      const response = await axiosInstance.get("/api/package_plan/");
      if (response.status === 200) {
        setPackages(response.data.filter((p) => p.id !== 1));
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ===================== PLANS ===================== */

  const handlePlanPurchase = async (plan) => {
    const key = `plan-${plan.id}`;
    try {
      setShow(true);
      setLoadingStates((prev) => ({ ...prev, [key]: true }));

      if (isShopifyUser) {
        const response = await axiosInstance.post("/stripe/shopify_charge/", {
          plan: plan.plan_type,
          shop: currentDomain,
        });
        if (response.data?.url) window.location.replace(response.data.url);
      } else {
        const response = await axiosInstance.post(
          "/stripe/stripe_checkout_session",
          {
            name_product: plan.plan_type,
            currentUser,
          }
        );
        if (response.data?.url) window.location.replace(response.data.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
      setShow(false);
    }
  };

  /* ===================== TOP UPS ===================== */

  const handleTopUp = async (topUp, index) => {
    const key = `topup-${index}`;
    if (!isShopifyUser) {
      alert("Top-ups are only available for Shopify users.");
      return;
    }

    try {
      setShow(true);
      setLoadingStates((prev) => ({ ...prev, [key]: true }));

      const response = await axiosInstance.post(
        "/stripe/shopify_one_time_charge/",
        {
          shop: currentDomain,
          amount: topUp.price,
          description: topUp.description,
        }
      );

      if (response.data?.url) {
        window.location.replace(response.data.url);
      }
    } catch (error) {
      console.error("Top-up error", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
      setShow(false);
    }
  };

  const sectionWrapper =
    "bg-[#0f1324] rounded-3xl px-10 py-10 shadow-xl";

  return (
    <section className="min-h-screen bg-[#0A0E1A]">
      {/* HEADER */}
      <div className="flex items-center h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-10">
        <Search />
        <SmsPill />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ===================== PLANS ===================== */}
        <section className={sectionWrapper}>
          <h3 className="text-2xl font-semibold text-white mb-3">
            Monthly Package Plans
          </h3>

          <p className="text-sm text-white/70 max-w-2xl mb-8">
            Plans do not include prepaid SMS credits only customer list access which allows you to use the platform.
            Credits are not being renewed in a billing cycle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packagePlan.map((plan) => {
              const isLoading = loadingState[`plan-${plan.id}`];
              return (
                <div
                  key={plan.id}
                  className={`bg-ngrokGray rounded-3xl p-7 shadow-lg
                    transition-all hover:-translate-y-1
                    ${isLoading ? "opacity-60 pointer-events-none" : ""}
                  `}
                >
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {plan.plan_type}
                  </h2>

                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={() => handlePlanPurchase(plan)}
                      disabled={isLoading}
                      className="px-5 py-2 rounded-full bg-purpleHaze text-white text-sm hover:bg-ngrokBlue transition"
                    >
                      {isLoading ? "Processing..." : "Choose plan"}
                    </button>

                    <span className="text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                  </div>

                  <ul className="space-y-3 text-sm text-white/80">
                    {[...Array(8)].map((_, i) => {
                      const offer = plan[`offer${i + 1}`];
                      return (
                        offer && (
                          <li key={i} className="flex gap-3">
                            <span className="w-2 h-2 mt-2 rounded-full bg-green-400" />
                            {offer}
                          </li>
                        )
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================== TOP UPS ===================== */}
        <section className={sectionWrapper}>
          <h3 className="text-2xl font-semibold text-white mb-3">
            One-time SMS Top-ups
          </h3>

          <p className="text-sm text-white/70 max-w-2xl mb-8">
            One-time purchases.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topUps.map((topUp, index) => {
              const isLoading = loadingState[`topup-${index}`];
              return (
                <div
                  key={index}
                  className="bg-[#161a34] rounded-2xl p-6 shadow-md transition hover:-translate-y-1"
                >
                  <h2 className="text-lg font-medium text-white mb-4">
                    {topUp.name}
                  </h2>

                  <div className="flex justify-between items-center">
                    <button
                      disabled={isLoading}
                      onClick={() => handleTopUp(topUp, index)}
                      className={`px-5 py-2 rounded-full text-sm transition
                        ${isLoading
                          ? "bg-white/20 text-white/70 cursor-not-allowed"
                          : "bg-purpleHaze text-white hover:bg-ngrokBlue"}
                      `}
                    >
                      {isLoading ? "Processing..." : "Buy top-up"}
                    </button>

                    <span className="text-3xl font-bold text-white">
                      ${topUp.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ModalComponent modalType="Redirect" showModal={show} />
      </div>
    </section>
  );
};

export default Plans;
