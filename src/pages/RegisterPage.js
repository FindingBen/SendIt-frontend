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
    <div>
      <section className="vh-100">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col-lg-7">
              <img
                src={require("../assets/psEdit.jpg")}
                className="img-fluid"
                alt="Sample image"
                style={{
                  objectFit: "fill",
                  width: "100%",
                  height: "100%",
                  marginLeft: "-12px",
                }}
              />
            </div>
            <div
              className="col-md-8 col-lg-6 col-xl-4 offset-xl-1"
              style={{ marginTop: "18%" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="divider d-flex align-items-center my-4">
                  <h2 className="text-3xl font-bold mb-4">Register</h2>
                </div>
                {errMsg && <p className="text-red-700">{errMsg}</p>}
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
                  {errMsgPass && <p className="text-red-700">{errMsgPass}</p>}
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
