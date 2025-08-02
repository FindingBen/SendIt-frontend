import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setShopifyCredentials } from "../redux/reducers/authSlice";
import { setPackage } from "../redux/reducers/packageReducer";
import jwt_decode from "jwt-decode";
import { config } from "../constants/Constants";
import { setUserInfo } from "../redux/reducers/userReducer";
import LoaderComponent from "../components/LoaderComponent";

const ShopifyLogin = () => {
  const BASE_URL = config.url.BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [username, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errPass, setErrPass] = useState("");
  //const shop = urlParams.get("shop");
  //   useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  //     const shop = urlParams.get("shop");
  const shop = urlParams.get("shop");

  useEffect(() => {
    handleAuth();
  }, []);


  const handleAuth = async (e) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/shopify-auth/?shop=${shop}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const responseData = await response.json();

      if (response.status == 200) {
        setLoading(false);
      }

      const tokenType = "Shopify";
      dispatch(setShopifyCredentials({ ...responseData, tokenType }));
      dispatch(setUserInfo({ ...responseData.user }));

      navigate("/home");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return <div>{loading ? <h1>U are being authenitcated</h1> : <></>}</div>;
};

export default ShopifyLogin;
