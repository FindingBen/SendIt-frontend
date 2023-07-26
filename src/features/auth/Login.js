import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBInput, MDBTypography } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import jwt_decode from "jwt-decode";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUser] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({
        username,
        password,
      });
      const user = jwt_decode(userData?.data?.access).user_id;

      dispatch(setCredentials({ ...userData?.data, user }));
      setUser("");
      setPwd("");

      localStorage.setItem("tokens", userData.data.refresh);
      navigate("/home");
    } catch (err) {
      console.log("errrrr", err);
      if (!err?.originalStatus) {
        localStorage.removeItem("tokens");
        // isLoading: true until timeout occurs
        setErrMsg("Wrong username or password!");
      } else if (err.originalStatus === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.originalStatus === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current?.focus();
    }
  };

  const handleUserInput = (e) => setUser(e.target.value);
  const handlePwdInput = (e) => setPwd(e.target.value);

  return (
    <div class="h-screen md:flex">
      <div class="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-gray-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <img src={require("../../assets/psEdit.jpg")}></img>
        </div>
        {/* <div class="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div class="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div class="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div class="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div> */}
      </div>
      <div class="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form class="bg-white" onSubmit={handleSubmit}>
          <h1 class="text-gray-800 font-bold text-2xl mb-1">Login</h1>
          <p class="text-sm font-normal text-gray-600 mb-7">
            Enter your credentials to continue
          </p>
          {errMsg && <p className="text-red-700">{errMsg}</p>}
          <div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              class="pl-2 outline-none border-none"
              type="text"
              onChange={handleUserInput}
              placeholder="Username"
            />
          </div>

          <div class="flex items-center border-2 py-2 px-3 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              class="pl-2 outline-none border-none"
              type="password"
              onChange={handlePwdInput}
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            class="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
          >
            Login
          </button>
          <span class="text-sm ml-2 hover:text-blue-500 cursor-pointer">
            <Link to="/reset_password" className="text-body">
              Forgot password?
            </Link>
          </span>
          <hr></hr>
          <p className="small fw-bold mt-2 pt-1 mb-0 mt-3">
            Don't have an account?{" "}
            <Link to="/register" className="link-danger">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
