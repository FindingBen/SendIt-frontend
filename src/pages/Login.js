import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/reducers/authSlice";
import { setPackage } from "../redux/reducers/packageReducer";
import jwt_decode from "jwt-decode";
import { config } from "../constants/Constants";
import { motion } from "framer-motion";
import { setUserInfo } from "../redux/reducers/userReducer";

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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();

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
        }
        setLoading(false);
      }
      const user = jwt_decode(responseData?.access).user_id;
      const packageValue = jwt_decode(responseData?.access).package_plan;
      const user_info = jwt_decode(responseData?.access);
      console.log(user_info);
      dispatch(setCredentials({ ...responseData, user }));
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
    <section class="flex flex-col justify-center antialiased bg-gradient-to-b from-lighterMainBlue to-mainBlue text-gray-200 min-h-screen p-4 w-100">
      <div class="flex-1">
        <div class="max-w-[360px] mx-auto mt-10 mb-5">
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
                  <div className="relative">
                    <svg
                      style={{ marginLeft: "45%" }}
                      aria-hidden="true"
                      className="w-8 h-8 mr-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 right-15"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  <button
                    type="submit"
                    class="font-semibold text-sm inline-flex items-center justify-center px-3 py-2 rounded-xl leading-5 shadow-lg transition duration-150 ease-in-out w-full bg-purpleHaze hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                  >
                    Login
                  </button>
                )}
              </form>
            </div>
            <span class="text-sm mt-3 p-2 hover:text-blue-500 cursor-pointer hover:bg-gray-300 rounded duration-300">
              <Link to="/reset_password" className=" text-white">
                Forgot password?
              </Link>
            </span>
          </div>
        </div>

        <p className="small fw-bold pt-1 mb-0 mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="link-danger">
            Register
          </Link>
        </p>
      </div>
      <p className="text-white opacity-60 font-light text-sm">
        © 2023 by Sendperplane
      </p>
    </section>
  );
};

export default Login;
