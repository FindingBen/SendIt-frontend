import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import ModalComponent from "../components/ModalComponent";
import { motion } from "framer-motion";
import { config } from "../constants/Constants";

const RegisterPage = () => {
  const BASE_URL = config.url.BASE_URL;
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [username, setUser] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPass] = useState("");
  const [user, setUserObj] = useState();
  const [registered, setRegistered] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsgPass, setErrMsgPass] = useState("");
  const [showModal, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
    setErrMsgPass("");
  }, [username, email, first_name, last_name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const bodyData = {
      email: email,
      username: username,
      first_name: first_name,
      last_name: last_name,
      password: password,
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
      if (responseData?.error?.status === 400) {
        if (responseData?.error?.data?.username) {
          setErrMsg(responseData.error.data.username);
          setLoading(false);
        } else if (responseData?.error?.data?.password) {
          setErrMsgPass(responseData.error.data.password);
          setLoading(false);
        }
        //setErrMsg("Missing Username or Password");
      } else if (responseData?.error?.status === 401) {
        setErrMsg("Unauthorized");
        setLoading(false);
      } else {
        dispatch(registerUser(responseData));
        setLoading(false);
        setErrMsgPass("Cannot be blank");
      }
    } catch (err) {
      console.log(err);
      setErrMsgPass(err);
      errRef.current.focus();
    }
  };
  const handleEmail = (e) => setEmail(e.target.value);
  const handleUserInput = (e) => setUser(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handlePassword = (e) => setPass(e.target.value);

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
    <section class="flex flex-col justify-center antialiased bg-darkBlue text-gray-200 min-h-screen p-4 w-100">
      <div class="flex-1">
        <div class="max-w-[360px] mx-auto mt-20 mb-5">
          {!registered ? (
            <div class="bg-white mt-9 rounded-md">
              <header class="text-center px-5 pb-5">
                <svg
                  class="inline-flex -mt-9 w-[72px] h-[72px] rounded-full border-4 border-white box-content shadow mb-3"
                  viewBox="0 0 72 72"
                >
                  <path class="text-gray-700" d="M0 0h72v72H0z" />
                  <image
                    href={require("../assets/IMG_2447.jpg")}
                    width="72"
                    height="72"
                  />
                </svg>

                <h3 class="text-xl font-bold text-gray-900 mb-1">Register</h3>
                <div class="text-sm font-medium text-gray-500">
                  Register your credentials below
                </div>
              </header>
              {errMsg && (
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
                  {errMsg}
                </motion.div>
              )}
              <div class="bg-gray-100 text-center px-5 py-6 rounded-b-md">
                <form class="space-y-3" onSubmit={handleSubmit}>
                  <div class="shadow-sm rounded">
                    <div class="flex-none">
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
                      <input
                        onChange={handleUserInput}
                        name="username"
                        class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                        type="text"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div class="shadow-sm rounded">
                    <div class="flex-none">
                      <input
                        onChange={handleFirstName}
                        name="first_name"
                        class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                        type="text"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div class="shadow-sm rounded">
                    <div class="flex-none">
                      <input
                        onChange={handleLastName}
                        name="last_name"
                        class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                        type="text"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div class="shadow-sm rounded">
                    <div class="flex-none">
                      <input
                        onChange={handleEmail}
                        name="email"
                        class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                        type="text"
                        placeholder="email"
                      />
                    </div>
                  </div>
                  <div class="shadow-sm rounded">
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
                    <div class="flex-none">
                      <input
                        onChange={handlePassword}
                        name="password"
                        class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                        type="password"
                        placeholder="Password"
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
                      class="font-semibold text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                    >
                      Register
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div class="relative flex flex-col items-center justify-center">
              <div class="max-w-xl px-5 text-center">
                <h2 class="mb-2 text-[42px] font-bold text-zinc-800">
                  Check your inbox
                </h2>
                <p class="mb-2 text-lg text-zinc-500">
                  We are glad, that you’re with us ? We’ve sent you a
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
        © 2023 by Sendperplane
      </p>
    </section>
  );
};

export default RegisterPage;
