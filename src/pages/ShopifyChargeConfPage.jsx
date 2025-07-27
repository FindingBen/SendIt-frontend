import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Search from "../components/SearchComponent/Search";
import SmsPill from "../components/SmsPill/SmsPill";
import useAxiosInstance from "../utils/axiosInstance";
import { useRedux } from "../constants/reduxImports";
import setPackage from "../redux/reducers/packageReducer";

const ShopifyChargeConfPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser, currentDomain, currentToken } = useRedux();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const shop = params.get("shop");

  useEffect(() => {
    checkUsersChargeStatus();
  }, []);

  const checkUsersChargeStatus = async () => {
    try {
      let response = await axiosInstance.get(`/stripe/users_charge/`);
      console.log(response);
      if (response.status === 200) {
        console.log("User charge status:", response.data);
        //setPackage(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen w-full items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-2 h-16 bg-navBlue sticky top-0 z-10">
        <Search />

        <SmsPill />
      </div>
      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6 mx-44">
            <h3 className="xl:text-2xl lg:text-xl text-normal font-euclid text-left text-white">
              Confirmation of subscription
            </h3>
          </div>

          <div className="flex justify-center mx-20">
            <p className="text-gray-50 text-xl">
              Confirmation of plan purchase for shop:{" "}
              <span className="text-cyan-500">{shop}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopifyChargeConfPage;
