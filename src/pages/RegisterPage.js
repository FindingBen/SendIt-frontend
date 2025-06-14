import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../redux/reducers/authSlice";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";

const RegisterPage = () => {
  const { dispatch } = useRedux();
  const BASE_URL = config.url.BASE_URL;
  const userRef = useRef();
  const errRef = useRef();
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUser] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPass] = useState("");
  const [rePassword, setRePass] = useState("");
  const [userType, setUserType] = useState("");
  const [user, setUserObj] = useState();
  const [registered, setRegistered] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [matchPassErr, setMatchPassErr] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errSelect, setErrSelect] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsgPass, setErrMsgPass] = useState("");
  const [showModal, setShow] = useState(false);

  useEffect(() => {
    getShopInfo();
  }, []);

  useEffect(() => {
    setErrMsg("");
    setErrMsgPass("");
    setMatchPassErr("");
    setErrEmail("");
  }, [username, email, first_name, last_name]);

  const getShopInfo = async (e) => {
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    if (shop) {
      let response = await fetch(
        `${BASE_URL}/api/shop_info/?shop=${encodeURIComponent(shop)}`
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log(data);
        setEmail(data?.shop?.email);
        setFirstName(data?.shop.first_name || "");
        setEmailReadOnly(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const bodyData = {
      custom_email: email,
      username: username,
      first_name: first_name,
      last_name: last_name,
      password: password,
      re_password: rePassword,
      user_type: userType,
      is_active: false,
    };
    try {
      const response = await fetch(`${BASE_URL}/api/register/`, {
        method: "POST",
        body: JSON.stringify(bodyData),

        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const responseData = await response.json();
      dispatch(registerUser(responseData));

      setUserObj(responseData);

      if (response.status === 200 || response.status === 201) {
        await handleConfirmation(responseData);
      }
      // Check if userData contains an error
      if (response.status === 400) {
        if (responseData.username) {
          if (responseData.username[0].startsWith("A user with")) {
            setErrMsg("Username is already in use");
          } else {
            setErrMsg("Can't be blank");
          }
          setLoading(false);
        } else if (responseData.password) {
          setErrMsgPass("Can't be blank");
          setLoading(false);
        } else if (responseData.custom_email) {
          if (responseData.custom_email[0].startsWith("A user with")) {
            setErrEmail("Email is already in use");
          } else {
            setErrEmail("Can't be blank");
          }
          setLoading(false);
        } else if (responseData.non_field_errors) {
          setMatchPassErr("Passwords don't match");
          setLoading(false);
        } else if (responseData.user_type) {
          setErrSelect("You have to choose one!");
          setLoading(false);
        } else if (responseData.re_password) {
          setMatchPassErr("Can't be blank");
          setLoading(false);
        }
      } else if (response.status === 401) {
        setErrMsg("Unauthorized");
        setLoading(false);
      } else {
        dispatch(registerUser(responseData));
        setLoading(false);
      }
    } catch (err) {
      setErrMsgPass(err);
      errRef.current.focus();
    }
  };
  const handleEmail = (e) => setEmail(e.target.value);
  const handleUserInput = (e) => setUser(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handlePassword = (e) => setPass(e.target.value);
  const handleRePassword = (e) => setRePass(e.target.value);

  const handleUserType = (e) => {
    setUserType(e.target.value);
  };
  const handleConfirmation = async (dataObj) => {
    const data = {
      user: dataObj.user,
    };
    let response = await fetch(`${BASE_URL}/api/confirm_email_verification/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 201) {
      setLoading(false);
      setRegistered(true);
    }
  };

  return (
    <section class="flex flex-col justify-center antialiased bg-gradient-to-b from-lighterMainBlue to-mainBlue text-gray-200 h-screen p-4 w-100">
      <div class="flex-1">
        <div class="max-w-[440px] mx-auto flex flex-col mb-5">
          {!registered ? (
            <div class="bg-navBlue border-2 border-gray-800 mt-9 rounded-2xl">
              <header class="text-center px-5 pb-5">
                <h3 class="text-xl font-semibold text-white mb-1 mt-2">
                  Register
                </h3>
                <div class="text-sm font-medium text-white/50 mt-2">
                  Register your credentials below
                </div>
              </header>

              <div class="bg-navBlue text-center px-5 py-2 rounded-b-2xl">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-row gap-2">
                    <div class="rounded-md">
                      <div class="flex-none">
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
                              className="text-red-700 h-4 text-sm"
                            >
                              {errMsg}
                            </motion.div>
                          )}
                        </div>

                        <input
                          onChange={handleUserInput}
                          name="username"
                          class={`text-sm text-gray-800 bg-white p-2 rounded-xl placeholder-gray-400 w-full border ${
                            errMsg ? "border-red-400" : ""
                          } rounded-md focus:border-indigo-300 focus:ring-0`}
                          type="text"
                          placeholder="Username"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="h-6"></div>
                      <div class="flex-none">
                        <input
                          onChange={handleFirstName}
                          name="first_name"
                          class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full rounded-xl p-2 border border-transparent focus:border-indigo-300 focus:ring-0"
                          type="text"
                          placeholder="First name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div>
                      <div className="h-6"></div>
                      <div class="flex-none">
                        <input
                          onChange={handleLastName}
                          name="last_name"
                          class="text-sm text-gray-800 bg-white placeholder-gray-400 p-2 rounded-xl w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                          type="text"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="h-6">
                        {errEmail && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2,
                              ease: [0, 0.41, 0.1, 1.01],
                            }}
                            className="text-red-700 text-sm"
                          >
                            {errEmail}
                          </motion.div>
                        )}
                      </div>
                      <div class="flex-none">
                        <input
                          onChange={handleEmail}
                          name="email"
                          value={email}
                          readOnly={emailReadOnly}
                          className={`text-sm ${
                            emailReadOnly
                              ? "text-gray-800 bg-white opacity-50"
                              : "text-gray-800 bg-white"
                          } placeholder-gray-400 p-2 w-full rounded-xl border ${
                            errEmail ? "border-red-400" : ""
                          } `}
                          type="text"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div>
                      <div className="h-6">
                        {errMsgPass && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2,
                              ease: [0, 0.41, 0.1, 1.01],
                            }}
                            className="text-red-700"
                          >
                            {errMsgPass}
                          </motion.div>
                        )}
                      </div>
                      <div class="flex-none">
                        <input
                          onChange={handlePassword}
                          name="password"
                          class={`text-sm text-gray-800 bg-white placeholder-gray-400 p-2 w-full rounded-xl border ${
                            errMsgPass ? "border-red-400" : ""
                          }`}
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="h-6">
                        {matchPassErr && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2,
                              ease: [0, 0.41, 0.1, 1.01],
                            }}
                            className="text-red-700"
                          >
                            {matchPassErr}
                          </motion.div>
                        )}
                      </div>
                      <div class="flex-none">
                        <input
                          onChange={handleRePassword}
                          name="password"
                          class={`text-sm text-gray-800 bg-white placeholder-gray-400 p-2 w-full rounded-xl border ${
                            matchPassErr ? "border-red-400" : ""
                          }`}
                          type="password"
                          placeholder="Repeat password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3 mb-3">
                    <label className="text-white/50 font-normal">
                      Who are you gona use the platform as?
                    </label>
                    <div className="h-4">
                      {errSelect && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.2,
                            ease: [0, 0.41, 0.1, 1.01],
                          }}
                          className="text-red-700"
                        >
                          {errSelect}
                        </motion.div>
                      )}
                    </div>
                    <select
                      placeholder="What type of user are you?"
                      onChange={handleUserType}
                      className={`bg-gray-50 border text-gray-900 text-sm rounded-lg ${
                        errSelect ? "border-red-400" : ""
                      } focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option value="">Select option</option>
                      <option value="Independent">Independent</option>
                      <option value="Business">Business</option>
                      <option value="Other">Other</option>
                    </select>
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
                      class="font-normal text-sm w-28 mb-3 text-smitems-center justify-center px-3 py-2 rounded-xl transition duration-150 ease-in-out bg-ngrokBlue hover:bg-ngrokBlue/70 text-white"
                    >
                      Register
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div class="relative flex flex-col items-center mt-24 justify-center">
              <div class="max-w-xl px-5 text-center">
                <h2 class="mb-2 text-[42px] font-normal text-white">
                  Check your inbox
                </h2>
                <p class="mb-2 text-lg text-white/50">
                  We are glad, that you’re with us! We’ve sent you a
                  verification link to the email address{" "}
                  <span class="font-medium text-indigo-500">{email}</span>.
                </p>
              </div>
            </div>
          )}
          <p className="small fw-bold mt-2 pt-1 mb-0">
            <Link to="/login" className="text-gray-300">
              Back to login
            </Link>
          </p>
        </div>
      </div>
      <ModalComponent
        showModal={showModal}
        modalType={"emailConfirm"}
      ></ModalComponent>
      <p className="text-white opacity-60 font-light text-sm">
        © 2025 by Sendperplane
      </p>
    </section>
  );
};

export default RegisterPage;
