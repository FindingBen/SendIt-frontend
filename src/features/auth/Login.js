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
    <div>
      <section className="vh-100">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col-lg-7">
              <img
                src={require("../../assets/psEdit.jpg")}
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
            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1  d-flex align-items-center justify-content-center mb-10">
              <div style={{ width: "75%" }}>
                <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <div>
                    <div>
                      <h1 class="text-2xl font-semibold">Login</h1>
                    </div>
                    <div class="divide-y divide-gray-200">
                      <form onSubmit={handleSubmit}>
                        <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                          <div class="relative">
                            {errMsg && <p className="text-red-700">{errMsg}</p>}
                            <input
                              autocomplete="off"
                              name="username"
                              type="text"
                              class="peer placeholder-transparent h-10 w-full border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                              placeholder="Username"
                              onChange={handleUserInput}
                            />
                            <label
                              for="email"
                              class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                            >
                              Username
                            </label>
                          </div>
                          <div class="relative">
                            <input
                              autocomplete="off"
                              id="password"
                              name="password"
                              type="password"
                              class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                              placeholder="Password"
                              onChange={handlePwdInput}
                            />
                            <label
                              for="password"
                              class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                            >
                              Password
                            </label>
                          </div>
                          <div class="relative">
                            <button class="bg-blue-500 text-white rounded-md px-2 py-1">
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                      
                    </div>
                    <div className="d-flex align-items-center" style={{marginLeft:'30%'}}>
                  <Link to="/reset_password" className="text-body">
                    Forgot password?
                  </Link>
                </div>
                <hr></hr>
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      
                    Don't have an account?{" "}
                    <Link to="/register" className="link-danger">
                      Register
                    </Link>
                  </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div
              className="col-md-8 col-lg-6 col-xl-4 offset-xl-1"
              style={{ marginTop: "18%" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="divider d-flex align-items-center my-4">
                  <h1 className="text-3xl font-bold mb-4">Login</h1>
                </div>

                <div
                  className="form-outline mb-4"
                  style={{ paddingRight: "130px" }}
                >
                  {errMsg && <p className="text-red-700">{errMsg}</p>}
                  <input
                    type="text"
                    name="username"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-full"
                    placeholder="Enter a username"
                    onChange={handleUserInput}
                  />
                </div>

                <div
                  className="form-outline mb-3"
                  style={{ paddingRight: "130px" }}
                >
                  <input
                    type="password"
                    name="password"
                    className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold px-4 border border-blue-700 rounded w-full"
                    placeholder="Enter password"
                    onChange={handlePwdInput}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/reset_password" className="text-body">
                    Forgot password?
                  </Link>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                  >
                    Login
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="link-danger">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
