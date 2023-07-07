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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, email, firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await register({
        email,
        username,
        firstName,
        lastName,
        password,
      });
      console.log(userData);
      dispatch(registerUser(userData));
      navigate("/home");
    } catch (err) {
      if (!err?.originalStatus) {
        // isLoading: true until timeout occurs
        setErrMsg("No Server Response");
      } else if (err.originalStatus === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.originalStatus === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };
  const handleEmail = (e) => setEmail(e.target.value);
  const handleUserInput = (e) => setUser(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handlePassword = (e) => setPass(e.target.value);

  return (
    <div>
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={handleSubmit}>
                <div className="divider d-flex align-items-center my-4">
                  <h2 className="text-3xl font-bold mb-4">Register</h2>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
                    placeholder="Enter a username"
                    onChange={handleUserInput}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
                    placeholder="john.doe@company.com"
                    onChange={handleEmail}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    name="first_name"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
                    placeholder="Enter your first name"
                    onChange={handleFirstName}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    name="last_name"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
                    placeholder="Enter your last name"
                    onChange={handleLastName}
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    name="password"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
                    placeholder="Enter your password"
                    onChange={handlePassword}
                  />
                </div>
                <button
                  className="bg-gray-800 hover:bg-green-400 mt-2 text-white font-bold py-2 px-4 border border-blue-700 rounded w-30"
                  type="submit"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
