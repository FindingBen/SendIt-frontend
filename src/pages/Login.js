import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/reducers/authSlice";
import { setPackage } from "../redux/reducers/packageReducer";
import jwt_decode from "jwt-decode";
import { config } from "../constants/Constants";
import { motion } from "framer-motion";
import { setUserInfo } from "../redux/reducers/userReducer";
import LoaderComponent from "../components/LoaderComponent";

const Login = () => {
  const BASE_URL = config.url.BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [username, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errPass, setErrPass] = useState("");

  useEffect(() => {
    setErrMsg("");
    setErrPass("");
  }, [username, pwd]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const bodyData = {
      username: username,
      password: pwd,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: "POST",
        body: JSON.stringify(bodyData),
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();
      console.log("AAAAAAAAA",responseData)
      if (!response.ok) {
        if (
          response.status === 400 &&
          responseData.username &&
          responseData.password
        ) {
          setErrMsg("Please fill the input!");
          setErrPass("Please fill in the input!");
          setLoading(false);
        } else if (response.status === 400 && responseData.password) {
          setErrPass("Please fill in the input!");
          setLoading(false);
        } else if (response.status === 400 && responseData.username) {
          setErrMsg("Please fill the input!");
          setLoading(false);
        } else if (response.status === 401) {
          setErrMsg("Credentials are wrong, try again.");
          setLoading(false);
        } else if (response.status === 401) {
          setErrMsg(response.detail);
        }
        setLoading(false);
      }
      const user = jwt_decode(responseData?.access).user_id;
      const packageValue = jwt_decode(responseData?.access).package_plan;
      const user_info = jwt_decode(responseData?.access);
      const shopify_token = user_info.shopify_token;
      const shop_id = user_info.shopify_id;
      const shopify_domain = user_info.shopify_domain;
      const tokenType = "JWT";
      console.log(user_info)
      dispatch(
        setCredentials({
          ...responseData,
          user,
          tokenType,
          shopify_token,
          shop_id,
          shopify_domain,
        })
      );
      dispatch(setPackage(packageValue));

      dispatch(setUserInfo({ ...user_info }));
      setUser("");
      setPwd("");
      localStorage.setItem("refreshToken", responseData?.refresh);

      navigate("/home");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0A0E1A] text-gray-200 p-4">
  {/* Login Card */}
  <div className="w-full max-w-[360px]">
    <div className="bg-[#111827] border-2 border-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <header className="text-center px-5 py-6 bg-[#1B2233]">
        {/* Optional Logo */}
        {/* <img src={require("../assets/logoSpp.PNG")} alt="Logo" className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-gray-800" /> */}
        <h3 className="text-2xl font-semibold text-white mb-1">Login</h3>
        <p className="text-gray-400 text-sm">
          Enter your credentials below to continue
        </p>
      </header>

      {/* Form */}
      <div className="px-6 py-6 bg-[#111827]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            {errMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0, 0.41, 0.1, 1.01] }}
                className="text-red-500 text-sm mb-1"
              >
                {errMsg}
              </motion.div>
            )}
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#1B2233] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ngrokBlue focus:border-ngrokBlue"
            />
          </div>

          {/* Password */}
          <div>
            {errPass && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0, 0.41, 0.1, 1.01] }}
                className="text-red-500 text-sm mb-1"
              >
                {errPass}
              </motion.div>
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPwd(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#1B2233] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ngrokBlue focus:border-ngrokBlue"
            />
          </div>

          {/* Submit Button */}
          {loading ? (
            <div className="flex justify-center">
              <LoaderComponent />
            </div>
          ) : (
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-ngrokBlue to-[#4937BA] hover:opacity-90 text-white font-semibold shadow-md transition duration-150"
            >
              Login
            </button>
          )}
        </form>
      </div>
    </div>

    {/* Links */}
    <div className="flex flex-col items-center gap-2 mt-4">
      <Link
        to="/reset_password"
        className="text-sm text-white hover:text-ngrokBlue transition-colors"
      >
        Forgot password?
      </Link>
      <p className="text-sm text-gray-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-ngrokBlue font-semibold hover:underline">
          Register
        </Link>
      </p>
    </div>

    {/* Footer */}
    <footer className="flex justify-center items-center gap-2 mt-6 text-sm text-white/70">
      <p>© 2025 by Sendperplane</p>
      <Link to="/privacy-policy" className="underline hover:text-ngrokBlue">
        Privacy
      </Link>
    </footer>
  </div>
</section>

  );
};

export default Login;
