import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBInput, MDBBtn, MDBTypography } from "mdb-react-ui-kit";

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
                <div class="divider d-flex align-items-center my-4">
                  <MDBTypography variant="h2">Login</MDBTypography>
                </div>

                <div class="form-outline mb-4">
                  <MDBInput
                    type="text"
                    name="username"
                    class="form-control form-control-lg"
                    placeholder="Enter a username"
                  />
                </div>

                <div class="form-outline mb-3">
                  <MDBInput
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

export default LoginPage;
