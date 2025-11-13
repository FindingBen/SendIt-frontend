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
      console.log(err);
      setErrMsgPass("An error occurred");
      setLoading(false);
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
    <section className="flex flex-col justify-center antialiased bg-[#0A0E1A] text-gray-200 h-screen p-4 w-full">
  <div className="flex-1 flex flex-col items-center justify-center">
    <div className="max-w-[440px] w-full">
      {!registered ? (
        <div className="bg-[#111827] border-2 border-gray-800 rounded-2xl shadow-md">
          {/* Header */}
          <header className="text-center px-5 pt-5 pb-3 border-b border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-1">Register</h3>
            <p className="text-sm text-white/50">Register your credentials below</p>
          </header>

          {/* Form */}
          <div className="px-5 py-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username & First Name */}
              <div className="flex gap-2">
                <div className="flex-1">
                  {errMsg && <p className="text-red-500 text-sm mb-1">{errMsg}</p>}
                  <input
                    onChange={handleUserInput}
                    name="username"
                    className={`w-full p-2 rounded-xl border-2 bg-[#1B2233] focus:outline-none ${
                      errMsg ? "border-red-500" : "border-gray-700"
                    } text-gray-900`}
                    type="text"
                    placeholder="Username"
                  />
                </div>
                <div className="flex-1">
                  <input
                    onChange={handleFirstName}
                    name="first_name"
                    className="w-full p-2 rounded-xl border-2 bg-[#1B2233] border-gray-700 focus:outline-none text-gray-900"
                    type="text"
                    placeholder="First name"
                  />
                </div>
              </div>

              {/* Last Name & Email */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    onChange={handleLastName}
                    name="last_name"
                    className="w-full p-2 rounded-xl border-2 bg-[#1B2233]  border-gray-700 focus:outline-none text-gray-900"
                    type="text"
                    placeholder="Last name"
                  />
                </div>
                <div className="flex-1">
                  {errEmail && <p className="text-red-500 text-sm mb-1">{errEmail}</p>}
                  <input
                    onChange={handleEmail}
                    name="email"
                    value={email}
                    readOnly={emailReadOnly}
                    className={`w-full p-2 rounded-xl border-2 bg-[#1B2233]  focus:outline-none text-gray-900 ${
                      emailReadOnly ? "opacity-50" : ""
                    } ${errEmail ? "border-red-500" : "border-gray-700"}`}
                    type="text"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Password & Repeat Password */}
              <div className="flex gap-2">
                <div className="flex-1">
                  {errMsgPass && <p className="text-red-500 text-sm mb-1">{errMsgPass}</p>}
                  <input
                    onChange={handlePassword}
                    name="password"
                    className={`w-full p-2 rounded-xl border-2 bg-[#1B2233]  focus:outline-none ${
                      errMsgPass ? "border-red-500" : "border-gray-700"
                    } text-gray-900`}
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className="flex-1">
                  {matchPassErr && <p className="text-red-500 text-sm mb-1">{matchPassErr}</p>}
                  <input
                    onChange={handleRePassword}
                    name="password"
                    className={`w-full p-2 rounded-xl border-2 bg-[#1B2233]  focus:outline-none ${
                      matchPassErr ? "border-red-500" : "border-gray-700"
                    } text-gray-900`}
                    type="password"
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              {/* User Type */}
              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-sm">Who are you going to use the platform as?</label>
                {errSelect && <p className="text-red-500 text-sm">{errSelect}</p>}
                <select
                  onChange={handleUserType}
                  className={`w-full p-2 rounded-xl border-2 bg-[#1B2233]  focus:outline-none text-gray-300 ${
                    errSelect ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <option value="">Select option</option>
                  <option value="Independent">Independent</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              {loading ? (
                <div className="flex justify-center mt-4">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
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
                  className="w-full py-2 rounded-xl bg-ngrokBlue hover:bg-ngrokBlue/70 text-white text-sm transition-all"
                >
                  Register
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-24 text-center">
          <h2 className="text-3xl font-normal text-white mb-2">Check your inbox</h2>
          <p className="text-white/50 text-lg">
            We are glad you’re with us! We’ve sent a verification link to{" "}
            <span className="font-medium text-indigo-500">{email}</span>. Check your inbox and spam folder.
          </p>
        </div>
      )}

      <p className="mt-4 text-center text-gray-300">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  </div>

  <ModalComponent showModal={showModal} modalType={"emailConfirm"} />
  <p className="text-white opacity-60 font-light text-sm text-center mt-4">
    © 2025 by Sendperplane
  </p>
</section>

  );
};

export default RegisterPage;
