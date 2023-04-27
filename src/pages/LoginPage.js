import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
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
              <form onSubmit={loginUser}>
                {/* <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p class="lead fw-normal mb-0 me-3">Sign in with</p>
                  <button
                    type="button"
                    class="btn btn-primary btn-floating mx-1"
                  >
                    <i class="fab fa-facebook-f"></i>
                  </button>

                  <button
                    type="button"
                    class="btn btn-primary btn-floating mx-1"
                  >
                    <i class="fab fa-twitter"></i>
                  </button>

                  <button
                    type="button"
                    class="btn btn-primary btn-floating mx-1"
                  >
                    <i class="fab fa-linkedin-in"></i>
                  </button>
                </div> */}

                <div class="divider d-flex align-items-center my-4">
                  <h2 class="text-center fw-bold mx-3 mb-0">Login</h2>
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    class="form-control form-control-lg"
                    placeholder="Enter a username"
                  />
                </div>

                <div class="form-outline mb-3">
                  <input
                    type="password"
                    name="password"
                    class="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <a href="#!" class="text-body">
                    Forgot password?
                  </a>
                </div>

                <div class="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" class="btn btn-primary btn-lg">
                    Login
                  </button>
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

export default LoginPage;
