import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBInput, MDBTypography } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useRegisterMutation } from "../features/auth/authApiSlice";
import jwt_decode from "jwt-decode";

const RegisterPage = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [username, setUser] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errMsgPass, setErrMsgPass] = useState("");
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
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

    try {
      const userData = await register({
        email,
        username,
        first_name,
        last_name,
        password,
      });
      console.log(userData);
      dispatch(registerUser(userData));

      // Check if userData contains an error
      if (userData?.error?.status === 400) {
        if (userData?.error?.data?.username) {
          setErrMsg(userData.error.data.username);
        } else if (userData?.error?.data?.password) {
          setErrMsgPass(userData.error.data.password);
        }
        //setErrMsg("Missing Username or Password");
      } else if (userData?.error?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        // No error, proceed with successful registration
        console.log(userData);
        dispatch(registerUser(userData));
        navigate("/home");
      }
    } catch (err) {
      console.log("AA");
      console.log(err);

      errRef.current.focus();
    }
  };
  const handleEmail = (e) => setEmail(e.target.value);
  const handleUserInput = (e) => setUser(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handlePassword = (e) => setPass(e.target.value);

  return (
    <div class="h-screen md:flex">
      <div class="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-gray-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <img src={require("../assets/psEdit.jpg")}></img>
        </div>
        {/* <div class="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div class="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div class="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div class="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div> */}
      </div>
      <div class="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form class="bg-white" onSubmit={handleSubmit}>
          <h1 class="text-gray-800 font-bold text-2xl mb-1">Register</h1>
          <p class="text-sm font-normal text-gray-600 mb-7">
            Enter your information to create an account
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
              onChange={handleFirstName}
              placeholder="First Name"
            />
          </div>
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
              onChange={handleLastName}
              placeholder="Last Name"
            />
          </div>
          <div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 text-gray-400"
            >
              <path
                stroke-linecap="round"
                d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
              />
            </svg>

            <input
              class="pl-2 outline-none border-none"
              type="text"
              onChange={handleEmail}
              placeholder="email"
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
              onChange={handlePassword}
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            class="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-3"
          >
            Sign up
          </button>
          <hr></hr>
          <p className="small fw-bold mt-2 pt-1 mb-0 mt-2">
            <Link to="/login" className="text-gray-800">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
    // <div>
    //   <section className="vh-100">
    //     <div className="container-fluid h-100">
    //       <div className="row h-100">
    //         <div className="col-lg-7">
    //           <img
    //             src={require("../assets/psEdit.jpg")}
    //             className="img-fluid"
    //             alt="Sample image"
    //             style={{
    //               objectFit: "fill",
    //               width: "100%",
    //               height: "100%",
    //               marginLeft: "-12px",
    //             }}
    //           />
    //         </div>
    //         <div
    //           className="col-md-8 col-lg-6 col-xl-4 offset-xl-1"
    //           style={{ marginTop: "18%" }}
    //         >
    //           <form onSubmit={handleSubmit}>
    //             <div className="divider d-flex align-items-center my-4">
    //               <h2 className="text-3xl font-bold mb-4">Register</h2>
    //             </div>
    //             {errMsg && <p className="text-red-700">{errMsg}</p>}
    //             <div className="form-outline mb-4">
    //               <input
    //                 type="text"
    //                 name="username"
    //                 className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
    //                 placeholder="Enter a username"
    //                 onChange={handleUserInput}
    //               />
    //             </div>
    //             <div className="form-outline mb-4">
    //               <input
    //                 type="email"
    //                 id="email"
    //                 className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
    //                 placeholder="john.doe@company.com"
    //                 onChange={handleEmail}
    //               />
    //             </div>
    //             <div className="form-outline mb-4">
    //               <input
    //                 type="text"
    //                 name="first_name"
    //                 className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
    //                 placeholder="Enter your first name"
    //                 onChange={handleFirstName}
    //               />
    //             </div>
    //             <div className="form-outline mb-4">
    //               <input
    //                 type="text"
    //                 name="last_name"
    //                 className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
    //                 placeholder="Enter your last name"
    //                 onChange={handleLastName}
    //               />
    //             </div>
    //             <div className="form-outline mb-4">
    //               {errMsgPass && <p className="text-red-700">{errMsgPass}</p>}
    //               <input
    //                 type="password"
    //                 name="password"
    //                 className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
    //                 placeholder="Enter your password"
    //                 onChange={handlePassword}
    //               />
    //             </div>
    //             <button
    //               className="bg-gray-800 hover:bg-green-400 mt-2 text-white font-bold py-2 px-4 border border-blue-700 rounded w-30"
    //               type="submit"
    //             >
    //               Register
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    // </div>
  );
};

export default RegisterPage;
