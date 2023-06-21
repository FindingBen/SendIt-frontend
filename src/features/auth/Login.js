import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBInput, MDBBtn, MDBTypography } from "mdb-react-ui-kit";
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
      const user = jwt_decode(userData.data.access).user_id;
      dispatch(setCredentials({ ...userData.data, user }));
      setUser("");
      setPwd("");

      localStorage.setItem("tokens", userData.data.refresh);
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

  const handleUserInput = (e) => setUser(e.target.value);
  const handlePwdInput = (e) => setPwd(e.target.value);

  return (
    <div>
      <section class="vh-100">
        <div class="container-fluid h-custom">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                class="img-fluid"
                alt="Sample image"
              />
            </div>
            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={handleSubmit}>
                <div class="divider d-flex align-items-center my-4">
                  <MDBTypography variant="h2">Login</MDBTypography>
                </div>

                <div class="form-outline mb-4">
                  <MDBInput
                    type="text"
                    name="username"
                    class="form-control form-control-lg"
                    placeholder="Enter a username"
                    onChange={handleUserInput}
                  />
                </div>

                <div class="form-outline mb-3">
                  <MDBInput
                    type="password"
                    name="password"
                    class="form-control form-control-lg"
                    placeholder="Enter password"
                    onChange={handlePwdInput}
                  />
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <a href="#!" class="text-body">
                    Forgot password?
                  </a>
                </div>

                <div class="text-center text-lg-start mt-4 pt-2">
                  <MDBBtn type="submit" color="dark" class="btn btn-primary">
                    Login
                  </MDBBtn>
                  <p class="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="link-danger">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
