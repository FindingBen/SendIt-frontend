import React, { useState, useEffect } from "react";
import { useLocation, useParam } from "react-router-dom";
import Search from "../components/SearchComponent/Search";
import SmsPill from "../components/SmsPill/SmsPill";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import { setPackage } from "../redux/reducers/packageReducer";

const ShopifyChargeConfPage = () => {
  const axiosInstance = useAxiosInstance();
  const { dispatch } = useRedux();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const params = new URLSearchParams(location.search);
  const shop = params.get("shop");
  const charge_id = params.get("charge_id");

  useEffect(() => {
    checkUsersChargeStatus();
  }, []);

  const checkUsersChargeStatus = async () => {
    setLoading(true);
    try {
      let response = await axiosInstance.get(
        `/stripe/users_charge/?charge_id=${charge_id}`
      );

      if (response.status === 200) {
        if (response.data.package) {
          const package_payload = {
            package_plan: response?.data.package.plan_type,
            sms_count: response?.data.package.sms_count_pack,
            list_limit: response.data.limits.contact_lists, // optional
            recipients_limit: response.data.limits.recipients, // optional
          };
          dispatch(setPackage(package_payload));
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        } else if (response.data.scheduled_package) {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
          setSuccessMessage(
            `Subscription triggered! Your plan will be activated on ${response.data.scheduled_date}`
          );
        } else if (response.data.status === 208) {
          setSuccessMessage(`Operation already completed!`);
          setLoading(false);
        }
        setLoading(false);
      } else if (response.status === 208) {
        setSuccessMessage(`Operation already completed!`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#111827] items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 h-16 bg-navBlue sticky top-0 z-10">
        <Search />

        <SmsPill />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            Confirmation of Subscription
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3e6ff4]"></div>
              <p className="text-lg text-white/80 animate-pulse">
                Checking your subscription...
              </p>
            </div>
          ) : (
            successMessage && (
              <div className="bg-[#23253a] border border-[#3e6ff4] rounded-2xl p-8 text-white shadow-lg mx-auto">
                <div className="flex flex-col items-center text-center space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h4 className="text-xl font-medium">
                    Subscription Confirmed
                  </h4>
                  <p className="text-green-400 text-base">{successMessage}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopifyChargeConfPage;
