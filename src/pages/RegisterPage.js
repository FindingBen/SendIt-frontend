import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const RegisterPage = () => {
  let { register } = useContext(AuthContext);
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
              <form onSubmit={register}>
                <div class="divider d-flex align-items-center my-4">
                  <h2 class="text-center fw-bold mx-3 mb-0">Register</h2>
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    class="form-control form-control-lg"
                    placeholder="Enter a username"
                  />
                </div>
                <div class="form-outline mb-4">
                  <input
                    type="text"
                    name="email"
                    class="form-control form-control-lg"
                    placeholder="Enter an email address"
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
                <button type="submit" class="btn btn-primary btn-lg">
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
