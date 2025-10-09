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
      console.log("DADA", user_info);
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
    <section class="flex flex-col items-center antialiased bg-gradient-to-b from-lighterMainBlue to-mainBlue text-gray-200 min-h-screen p-4 w-100">
      <div class="flex-1">
        <div class="max-w-[360px] mx-auto mt-10 mb-2">
          <div class="bg-navBlue border-2 border-gray-800 h-[420px] rounded-lg mt-3">
            <header class="text-center px-5 pb-5">
              {/* <svg
                class="inline-flex -mt-9 w-[72px] h-[72px] bg-gray-800 rounded-full border-gray-800 border-2 mb-3"
                viewBox="0 0 72 72"
              >
                <path class="text-gray-700" d="M0 0h72v72H0z" />
                <image
                  href={require("../assets/logoSpp.PNG")}
                  width="72"
                  height="72"
                />
              </svg> */}

              <h3 class="text-xl font-semibold text-white mb-1 mt-5">Login</h3>
              <div class="text-sm font-medium text-gray-500">
                Enter your credentials below to continue
              </div>
            </header>

            <div class="bg-navBlue mb-4 text-center px-5 py-6">
              <form class="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <div className="h-6">
                    {errMsg && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="text-red-600"
                      >
                        {errMsg}
                      </motion.div>
                    )}
                  </div>
                  <div class="flex-none">
                    <input
                      onChange={(e) => setUser(e.target.value)}
                      name="username"
                      class="text-sm text-gray-800 bg-white placeholder-gray-400 rounded-xl p-2 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                      type="text"
                      placeholder="username"
                    />
                  </div>
                </div>
                <div>
                  <div className="h-6">
                    {errPass && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="text-red-600"
                      >
                        {errPass}
                      </motion.div>
                    )}
                  </div>
                  <div class="flex-none">
                    <input
                      onChange={(e) => setPwd(e.target.value)}
                      name="password"
                      class="text-sm text-gray-800 bg-white mb-3 placeholder-gray-400 p-2 rounded-xl w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                      type="password"
                      placeholder="password"
                    />
                  </div>
                </div>
                {loading ? (
                  <div className="relative mx-auto items-center">
                    <LoaderComponent className="mx-auto" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    class="font-normal text-sm inline-flex items-center justify-center px-3 py-2 rounded-xl leading-5 shadow-lg transition duration-150 ease-in-out w-full bg-ngrokBlue hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                  >
                    Login
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span class="text-sm p-2 cursor-pointer hover:bg-gray-500 rounded duration-300 mx-auto">
            <Link to="/reset_password" className=" text-white">
              Forgot password?
            </Link>
          </span>
          <p className="small fw-bold pt-1 mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="link-danger">
              Register
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 text-center">
        <p className="text-white opacity-60 font-light text-sm">
          © 2025 by Sendperplane
        </p>
        <Link className="mt-1 text-xs underline" to={"/privacy-policy"}>
          Privacy
        </Link>
      </div>
    </section>
  );
};

export default Login;
